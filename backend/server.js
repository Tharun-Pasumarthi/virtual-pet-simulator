require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/database');
const { apiLimiter } = require('./src/utils/rateLimiter');
const errorHandler = require('./src/middleware/errorHandler');
const { cacheMiddleware, cache } = require('./src/utils/cache');
const { updateUserCoins } = require('./src/utils/coinGenerator');
const Pet = require('./src/models/Pet');
const User = require('./src/models/User');

// Import routes
const authRoutes = require('./src/routes/auth');
const petRoutes = require('./src/routes/pet');
const shopRoutes = require('./src/routes/shop');
const miniGameRoutes = require('./src/routes/minigame');
const dailyTaskRoutes = require('./src/routes/dailyTask');
const coinRoutes = require('./src/routes/coins');
const assetsRouter = require('./src/routes/assets');
const userRoutes = require('./src/routes/user');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
});

connectDB();

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(hpp());

// Static files (e.g., images)
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Performance Middleware
app.use(compression());

// API Rate Limiting
app.use('/api', apiLimiter);

// Attach socket.io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const apiRouter = express.Router();

// Mount routes on API router
apiRouter.use('/auth', authRoutes);
apiRouter.use('/pets', petRoutes);
apiRouter.use('/shop', shopRoutes);
apiRouter.use('/minigames', miniGameRoutes);
apiRouter.use('/daily-tasks', dailyTaskRoutes);
apiRouter.use('/coins', coinRoutes);
apiRouter.use('/assets', assetsRouter);
apiRouter.use('/user', userRoutes);

// Mount API router
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Handle 404s
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('updateCoins', async ({ userId }) => {
    const coinsAdded = await updateUserCoins(userId);
    if (coinsAdded) {
      const user = await User.findById(userId);
      socket.emit('coinsUpdated', { coins: user.coins });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Received shutdown signal. Starting graceful shutdown...');
  httpServer.close(async () => {
    try {
      await mongoose.connection.close();
      console.log('Database connection closed.');
      
      cache.flushAll();
      console.log('Cache cleared.');
      
      console.log('Graceful shutdown completed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const PORT = 5001;
httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});