import { io } from 'socket.io-client';

// Create socket connection
const socket = io('http://localhost:5001', {
  withCredentials: true,
  autoConnect: false
});

// Connection event handlers
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Export socket instance
export { socket }; 