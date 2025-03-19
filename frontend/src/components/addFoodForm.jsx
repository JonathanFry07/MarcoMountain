import React, { useState } from 'react';

const FoodForm = ({close}) => {
  // States to hold form data
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!food || !calories || !carbs || !fat || !protein) {
      setError('All fields are required!');
      return;
    }

    // Form data processing logic here
    const formData = {
      food,
      calories,
      carbs,
      fat,
      protein,
    };

    console.log('Form Submitted:', formData);
    close();
    setError('');
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4 text-center">Food Information</h2>

      {/* Error message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Food Name */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Food</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Food name"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            required
          />
        </div>

        {/* Calories */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </div>

        {/* Carbs */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Carbs"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            required
          />
        </div>

        {/* Fat */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Fat"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            required
          />
        </div>

        {/* Protein */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Protein"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all w-full"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodForm;
