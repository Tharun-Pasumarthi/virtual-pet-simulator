import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Add global styles
const style = document.createElement('style');
style.textContent = `
  :root {
    --bg-color: #f5f5f5;
    --text-color: #1a1a1a;
    --primary-color: #22c55e;
    --secondary-color: #2563eb;
    --accent-color: #ec4899;
    --card-bg: #ffffff;
    --border-color: #e5e5e5;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  button {
    font-family: inherit;
  }

  button:hover {
    opacity: 0.9;
  }

  button:active {
    transform: translateY(1px);
  }

  select, input {
    font-family: inherit;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-color: #1a1a1a;
      --text-color: #ffffff;
      --primary-color: #4ade80;
      --secondary-color: #3b82f6;
      --accent-color: #f472b6;
      --card-bg: #2d2d2d;
      --border-color: #404040;
    }
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
