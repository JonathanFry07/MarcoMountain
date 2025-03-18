import { useAuthStore } from "@/store/authStore";
import React, { useEffect, useState } from "react";

const MealPage = () => {
  const { getMeals, meals, isLoading, postMeal, user } = useAuthStore();
  const [expandedMeals, setExpandedMeals] = useState({});
  const [selectedMealTypes, setSelectedMealTypes] = useState({});
  const [servings, setServings] = useState({});

  // Fetch meals only once on mount
  useEffect(() => {
    getMeals();
  }, [getMeals]);

  const toggleExpand = (mealId) => {
    setExpandedMeals((prev) => ({
      ...prev,
      [mealId]: !prev[mealId],
    }));
  };

  const handleMealTypeSelect = (mealId, mealType) => {
    setSelectedMealTypes((prev) => ({
      ...prev,
      [mealId]: mealType,
    }));
  };

  // Update servings state without forcing a minimum.
  const handleServingsChange = (mealId, value) => {
    setServings((prev) => ({
      ...prev,
      [mealId]: value,
    }));
  };

  const handleTrackMeal = async (meal) => {
    const selectedType = selectedMealTypes[meal._id];
    if (!selectedType) {
      alert("Please select a meal type before tracking!");
      return;
    }

    // Use the entered servings value, defaulting to 1 if no valid value is provided.
    const servingsCount = servings[meal._id] || 1;

    // Scale the foods array by servingsCount
    const scaledFoods = meal.foods.map((food) => ({
      ...food,
      servingSize: food.servingSize * servingsCount,
      calories: food.calories * servingsCount,
      protein: food.protein * servingsCount,
      carbs: food.carbs * servingsCount,
      fat: food.fat * servingsCount,
    }));

    // Scale the total macros by servingsCount
    const scaledTotalMacros = {
      calories: meal.totalMacros.calories * servingsCount,
      protein: meal.totalMacros.protein * servingsCount,
      carbs: meal.totalMacros.carbs * servingsCount,
      fat: meal.totalMacros.fat * servingsCount,
    };

    try {
      await postMeal(user.email, meal.name, selectedType, scaledFoods, scaledTotalMacros);
      alert(`Meal ${meal.name} tracked as ${selectedType} for ${servingsCount} serving(s)`);
    } catch (error) {
      console.error("Error tracking meal:", error);
      alert("There was an error tracking the meal.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading meals...</p>
        ) : meals?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meals.map((meal) => (
              <div
                key={meal._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(meal._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{meal.name}</h2>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide mt-1">
                        {meal.mealType}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">{meal.prepTime} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-orange-500 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">{meal.ingredients.length} ingredients</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-bold text-gray-700">{meal.totalMacros.calories} cal</span>
                    </div>
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-colors focus:outline-none"
                      aria-label={expandedMeals[meal._id] ? "Collapse details" : "Expand details"}
                    >
                      {expandedMeals[meal._id] ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Details */}
                {expandedMeals[meal._id] && (
                  <div className="border-t border-gray-200">
                    {/* Track This Meal Section */}
                    <div className="p-4 bg-green-50">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                        Track This Meal
                      </h3>
                      {/* Servings Input */}
                      <div className="mb-3">
                        <label
                          htmlFor={`servings-${meal._id}`}
                          className="block text-sm font-medium text-gray-700"
                        >
                          Servings
                        </label>
                        <input
                          id={`servings-${meal._id}`}
                          type="number"
                          step="0.1"
                          value={servings[meal._id] || ""}
                          onChange={(e) =>
                            handleServingsChange(
                              meal._id,
                              parseFloat(e.target.value)
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {["breakfast", "lunch", "dinner", "snack"].map((type) => (
                          <button
                            key={type}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              selectedMealTypes[meal._id] === type
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMealTypeSelect(meal._id, type);
                            }}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        ))}
                      </div>
                      <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackMeal(meal);
                        }}
                      >
                        Track Meal
                      </button>
                    </div>

                    {/* Macros */}
                    <div className="p-4 bg-blue-50 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Nutritional Information
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-white p-3 rounded shadow-sm text-center">
                          <p className="text-xs text-gray-500">Calories</p>
                          <p className="text-lg font-bold text-blue-600">{meal.totalMacros.calories}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm text-center">
                          <p className="text-xs text-gray-500">Protein</p>
                          <p className="text-lg font-bold text-green-600">{meal.totalMacros.protein}g</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm text-center">
                          <p className="text-xs text-gray-500">Carbs</p>
                          <p className="text-lg font-bold text-yellow-600">{meal.totalMacros.carbs}g</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm text-center">
                          <p className="text-xs text-gray-500">Fat</p>
                          <p className="text-lg font-bold text-red-600">{meal.totalMacros.fat}g</p>
                        </div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="p-4 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Ingredients
                      </h3>
                      <ul className="grid grid-cols-2 gap-2">
                        {meal.ingredients.map((ingredient) => (
                          <li key={ingredient._id} className="flex items-center text-gray-700 text-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-green-500 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {ingredient.ingredientName} ({ingredient.amountInGrams}g)
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Preparation Steps */}
                    <div className="p-4 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Preparation
                      </h3>
                      <ol className="space-y-2">
                        {meal.preparationSteps
                          .sort((a, b) => a.stepNumber - b.stepNumber)
                          .map((step) => (
                            <li key={step._id} className="text-gray-700 text-sm">
                              <span className="font-medium">Step {step.stepNumber}:</span> {step.description}
                            </li>
                          ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No meals found.</p>
        )}
      </div>
    </div>
  );
};

export default MealPage;
