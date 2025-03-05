import { Plus } from "lucide-react";
import React, { useState } from "react";
import AddWorkoutForm from "./AddWorkoutForm";

const AddWorkoutButton = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      {toggle && (
        <div>
          <AddWorkoutForm onClose={() => setToggle(false)} />
        </div>
      )}

      <button
        onClick={() => setToggle(!toggle)}
        className="fixed bottom-20 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
};

export default AddWorkoutButton;
