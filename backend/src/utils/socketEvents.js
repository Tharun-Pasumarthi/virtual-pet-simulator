const coinService = require('../services/coinService');

const setupSocketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Start coin generation for a user
    socket.on('startCoinGeneration', async ({ userId }) => {
      try {
        await coinService.startCoinGeneration(userId);
        // Send initial coins
        const coins = await coinService.getCurrentCoins(userId);
        socket.emit('coinsUpdated', { coins });
      } catch (error) {
        console.error('Error starting coin generation:', error);
      }
    });

    // Stop coin generation for a user
    socket.on('stopCoinGeneration', ({ userId }) => {
      coinService.stopCoinGeneration(userId);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = setupSocketEvents; 