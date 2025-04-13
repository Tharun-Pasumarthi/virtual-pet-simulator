import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PetView from './components/pet/PetView';
import Shop from './components/shop/Shop';
import MiniGames from './components/games/MiniGames';
import Breeding from './components/breeding/Breeding';
import NavBar from './components/common/NavBar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PetProvider } from './contexts/PetContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PetCollection from './components/pet/PetCollection';
import FunZone from './components/pet/FunZone';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <PetProvider>
            <div style={{
              minHeight: '100vh',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-color)',
              transition: 'all 0.3s ease',
              fontFamily: "'Poppins', sans-serif"
            }}>
              <NavBar />
              <main style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px'
              }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/pet/:id" element={
                    <PrivateRoute>
                      <PetView />
                    </PrivateRoute>
                  } />
                  <Route path="/shop" element={
                    <PrivateRoute>
                      <Shop />
                    </PrivateRoute>
                  } />
                  <Route path="/games" element={
                    <PrivateRoute>
                      <MiniGames />
                    </PrivateRoute>
                  } />
                  <Route path="/breeding" element={
                    <PrivateRoute>
                      <Breeding />
                    </PrivateRoute>
                  } />
                  <Route path="/pet-collection" element={
                    <PrivateRoute>
                      <PetCollection />
                    </PrivateRoute>
                  } />
                  <Route path="/fun-zone/:petId" element={
                    <PrivateRoute>
                      <FunZone />
                    </PrivateRoute>
                  } />
                </Routes>
              </main>
            </div>
          </PetProvider>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
