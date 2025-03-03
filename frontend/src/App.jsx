import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeLayoutPage from './pages/homeLayoutPage';
import { useAuthStore } from './store/authStore';
import WorkOutPage from './pages/workOutPage';
import BottomNavbar from './components/BottomNavbar';
import LogOut from './components/LogOut';
import Logo from './components/Logo';

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(user);
  console.log(isAuthenticated);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Fixed Top Logo */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Logo />
          {isAuthenticated && <LogOut />}
        </div>
      </div>

      {/* Main Content Area (Scrolls between Logo and Bottom Navbar) */}
      {/* Adjusted padding-top to prevent overlap with the logo */}
      <div className="pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-y-auto flex-grow">
        <Routes>
          <Route path="/" element={<HomeLayoutPage />} />
          <Route path="/workout" element={<WorkOutPage />} />
        </Routes>
      </div>

      {/* Fixed Bottom Navbar */}
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10 sm:block">
          <BottomNavbar />
        </div>
      )}
    </div>
  );
}

export default App
