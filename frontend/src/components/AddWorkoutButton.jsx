import { Plus, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import AddWorkoutForm from "./AddWorkoutForm";
import ImportUrl from "./import/importUrl";

const AddWorkoutButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importUrl, setImportUrl] = useState("");

  const handleCreateNew = () => {
    setShowForm(true);
    setShowImport(false);
    setShowOptions(false);
  };

  const handleImport = () => {
    setShowImport(true);
    setShowForm(false);
    setShowOptions(false);
  };

  return (
    <>
      {/* Workout Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <AddWorkoutForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Import URL Form */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <ImportUrl
            url={importUrl}
            type="url"
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder="Enter workout URL"
            onClose={() => setShowImport(false)}
          />
        </div>
      )}


      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-6 flex flex-col items-center space-y-4 z-40">
        {showOptions && (
          <>
            <button
              onClick={handleImport}
              className="bg-white shadow-lg rounded-full p-4 flex items-center justify-center hover:bg-gray-100 transition"
              title="Import Workout"
            >
              <UploadCloud className="w-6 h-6 text-green-500" />
            </button>
            <button
              onClick={handleCreateNew}
              className="bg-white shadow-lg rounded-full p-4 flex items-center justify-center hover:bg-gray-100 transition"
              title="Create New Workout"
            >
              <Plus className="w-6 h-6 text-green-500" />
            </button>
          </>
        )}
        {/* Show toggle only when no forms are open */}
        {!showForm && !showImport && (
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="bg-green-500 rounded-full p-5 shadow-lg flex items-center justify-center text-white hover:bg-green-600 transition"
            aria-label="Toggle workout options"
          >
            <Plus
              className={`w-6 h-6 transform transition-transform duration-300 ${showOptions ? "rotate-45" : "rotate-0"
                }`}
            />
          </button>
        )}
      </div>
    </>
  );
};

export default AddWorkoutButton;
