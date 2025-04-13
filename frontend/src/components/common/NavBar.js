import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/games', label: 'Games' },
    { path: '/breeding', label: 'Breeding' }
  ];

  return (
    <nav style={{
      backgroundColor: 'var(--card-bg)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem',
      marginBottom: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <h1 style={{
            color: 'var(--primary-color)',
            margin: 0,
            fontSize: '1.5rem',
            cursor: 'pointer'
          }} onClick={() => navigate('/')}>
            Virtual Pet
          </h1>

          {user && (
            <div style={{
              display: 'flex',
              gap: '1.5rem'
            }}>
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isActive(item.path) ? 'var(--primary-color)' : 'var(--text-color)',
                    cursor: 'pointer',
                    fontWeight: isActive(item.path) ? 'bold' : 'normal',
                    padding: '0.5rem',
                    transition: 'color 0.2s'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-color)',
              cursor: 'pointer',
              padding: '0.5rem',
              fontSize: '1.25rem'
            }}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>

          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{
                color: 'var(--text-color)'
              }}>
                {user.username}
              </span>
              <button
                onClick={logout}
                style={{
                  backgroundColor: 'var(--accent-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
