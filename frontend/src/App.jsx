import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeLayoutPage from './pages/homeLayoutPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<HomeLayoutPage />} />
          <Route path="/signup" element={<SignUpPage /> } />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
