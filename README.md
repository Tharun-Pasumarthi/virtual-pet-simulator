# Virtual Pet Simulator

An interactive web-based virtual pet simulator inspired by games like Talking Tom.

## Features

### 🔐 User Management
- User registration and login with JWT authentication
- Secure pet data storage in MongoDB

### 🐾 Pet System
- Start with one unlocked pet
- Pet stats: hunger, happiness, energy/sleep, playfulness
- Experience and leveling system
- Dynamic emotion states

### 🕹️ Interactions
- Feed, Play, Sleep, and Pet interactions
- Real-time stat updates

### 💰 Economy System
- Real-time coin earning (1 coin/sec online, 0.5 coins/sec offline)
- Daily tasks and missions
- Login streak rewards

### 🎮 Mini-Games & Rewards
- Interactive mini-games
- Energy system for actions
- Coin rewards

### 🌒 Dynamic Time System
- Real-time clock integration
- Automatic light/dark mode
- Time-based pet behavior

### 🧬 Breeding System
- Pet breeding mechanics
- Trait inheritance system
- PetDex collection tracking

### 🛍️ Shop & Customization
- Accessories and backgrounds shop
- Pet customization options
- Virtual currency system

## Tech Stack
- Frontend:
  - React 18
  - React Router for navigation
  - Axios for API calls
  - Socket.IO client for real-time updates
  - CSS Modules for styling

- Backend:
  - Node.js & Express.js
  - MongoDB for database
  - JWT for authentication
  - Socket.IO for real-time features
  - Mongoose ODM

## Project Structure
```
/frontend
  /src
    /components
    /pages
    /context
    /services
    /utils
/backend
  /src
    /controllers
    /models
    /routes
    /middleware
    /utils
/docs
```

## Setup Instructions
1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend setup
   cd backend
   npm install

   # Frontend setup
   cd frontend
   npm install
   ```
3. Set up environment variables:
   ```bash
   # Backend setup (.env)
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. Set up the database:
   - Make sure MongoDB is installed and running
   - Create a new database named 'virtual-pet-simulator'
   - Seed the database with sample data:
     ```bash
     cd backend
     node src/seed/seed.js
     ```

5. Start the servers:
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm start
   ```

6. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

7. Sample login credentials:
   ```
   Username: testuser1
   Email: test1@example.com
   Password: password123
   ```

## Deployment Instructions

### Prerequisites
1. Node.js (v16 or higher)
2. MongoDB (v4.4 or higher)
3. Git

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/virtual-pet-simulator.git
   cd virtual-pet-simulator/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Initialize the database:
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Build and start:
   ```bash
   # Development
   npm start
   
   # Production
   npm run build
   ```

### Production Deployment

#### Backend Deployment (Heroku)
1. Create a new Heroku app
2. Add MongoDB Atlas connection string to environment variables
3. Deploy using Heroku Git:
   ```bash
   git subtree push --prefix backend heroku main
   ```

#### Frontend Deployment (Netlify)
1. Create a new Netlify site
2. Configure build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/build`
3. Add environment variables in Netlify dashboard
4. Deploy:
   ```bash
   git push origin main
   ```

### Database Seeding

The project includes seed data for:
- Pet types
- Accessories
- Food items
- Achievements
- Daily tasks

Run the seeding script:
```bash
cd backend
npm run seed
```

### Monitoring & Maintenance

1. Backend Health Check:
   ```
   GET /health
   ```

2. Monitor logs:
   ```bash
   # Heroku
   heroku logs --tail
   ```

3. Database backup:
   ```bash
   # MongoDB Atlas
   mongodump --uri="your_mongodb_uri"
   ```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/virtual-pet-simulator
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Available Sample Data

The seed script creates the following sample data:

### Users
- testuser1 (1000 coins)
- testuser2 (500 coins)

### Pets
- Fluffy (cat, owned by testuser1)
- Rex (dog, owned by testuser2)

### Shop Items
- Premium Food (100 coins)
- Toy Ball (50 coins)

### Mini Games
- Fetch (50 coins reward)
- Hide and Seek (75 coins reward)

### Daily Tasks
- Feed your pet (100 coins reward)
- Play mini games (150 coins reward)

## Security Considerations

1. Rate limiting is enabled
2. CORS is configured for production
3. Security headers are set
4. Input validation is implemented
5. MongoDB injection prevention is active

## Support & Troubleshooting

Common issues:
1. CORS errors: Check FRONTEND_URL in backend .env
2. MongoDB connection: Verify MONGODB_URI
3. WebSocket connection: Ensure REACT_APP_SOCKET_URL is correct

For support:
- Open an issue on GitHub
- Check the logs for detailed error messages
#   v i r t u a l - p e t - s i m u l a t o r  
 #   d j a n g o - p r o j e c t  
 