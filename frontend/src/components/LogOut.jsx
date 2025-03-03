import React from 'react';
import { LogOut as LogOutIcon } from 'lucide-react';
import { useAuthStore } from "../store/authStore.js";

const LogOut = () => {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button 
      onClick={handleLogout}
      className="group flex items-center px-3 py-3 mt-3 ml-3 transition-colors duration-200 hover:bg-gray-300 rounded-md"
    >
      <div className="w-6 h-6 text-teal-400 group-hover:text-gray-700">
        <LogOutIcon size={24} />
      </div>
    </button>
  );
};

export default LogOut;