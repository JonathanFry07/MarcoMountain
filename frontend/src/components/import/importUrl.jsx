import React from "react";

const ImportUrl = ({ url, type = "text", onChange, placeholder = "Enter URL...", onClose }) => {
    return (
        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md mx-auto mt-10 relative">
            <h2 className="text-xl font-semibold mb-4">Import Workout</h2>

            <input
                type={type}
                value={url}
                onChange={onChange}
                placeholder={placeholder}
                className="
          w-full
          p-2
          text-base
          rounded-md
          border
          border-gray-300
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition
          duration-200
          ease-in-out
        "
            />
            <div className="mt-4 flex justify-end space-x-2">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 "
                    aria-label="Close import form"
                >
                    Close
                </button>
                <button
                    onClick={() => alert(`Importing from: ${url}`)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    disabled={!url.trim()}
                >
                    Import
                </button>
            </div>
        </div>
    );
};

export default ImportUrl;
