import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeLayoutPage from './pages/homeLayoutPage';
import { useAuthStore } from './store/authStore';
import WorkOutPage from './pages/workOutPage';
import BottomNavbar from './components/BottomNavbar';
import LogOut from './components/LogOut';
import Logo from './components/Logo';
import TrackingPage from './pages/TrackingPage';
import TrackingWorkoutPage from './pages/TrackingWorkoutPage';
import CalendarPage from './pages/CalendarPage';
import ProgressPage from './pages/ProgressPage';
import TrackingCaloriesPage from './pages/TrackingCalroiesPage';
import MealPage from './pages/MealPage';

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated && !user) {
    return <Navigate to="/" replace/>;
  }
  return children
};

function App() {

  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
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
          <Route path="/workout" element={<ProtectRoute><WorkOutPage /></ProtectRoute>} />
          <Route path="/tracking" element={<ProtectRoute><TrackingPage /></ProtectRoute>} />
          <Route path="/tracking-workout/:id" element={<ProtectRoute><TrackingWorkoutPage /></ProtectRoute>} />
          <Route path="/recent-activity" element={<ProtectRoute><CalendarPage /></ProtectRoute>} />
          <Route path="/progress" element={<ProtectRoute><ProgressPage /></ProtectRoute>} />
          <Route path="/calories" element={<ProtectRoute><TrackingCaloriesPage /></ProtectRoute>} />
          <Route path="/meals" element={<ProtectRoute><MealPage /></ProtectRoute>} />
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
