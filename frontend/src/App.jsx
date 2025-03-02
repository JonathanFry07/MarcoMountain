import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeLayoutPage from './pages/homeLayoutPage';

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<HomeLayoutPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
