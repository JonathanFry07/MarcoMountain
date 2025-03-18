import React, { useState } from "react";

const MealPage = () => {
    // Sample data
    const data = {
        "success": true,
        "message": "Meals fetched successfully",
        "meals": [
            {
                "totalMacros": {
                    "calories": 265,
                    "protein": 31,
                    "carbs": 3,
                    "fat": 10
                },
                "_id": "67d983e1540d0684d48ba3b8",
                "mealId": 670875,
                "email": "test@example.com",
                "name": "Chicken Salad",
                "mealType": "lunch",
                "prepTime": 15,
                "foods": [
                    {
                        "name": "Chicken Breast",
                        "servingSize": 200,
                        "calories": 250,
                        "protein": 30,
                        "carbs": 0,
                        "fat": 10,
                        "_id": "67d983e1540d0684d48ba3b9"
                    },
                    {
                        "name": "Lettuce",
                        "servingSize": 100,
                        "calories": 15,
                        "protein": 1,
                        "carbs": 3,
                        "fat": 0,
                        "_id": "67d983e1540d0684d48ba3ba"
                    }
                ],
                "ingredients": [
                    {
                        "ingredientName": "Chicken Breast",
                        "amountInGrams": 200,
                        "_id": "67d983e1540d0684d48ba3bb"
                    },
                    {
                        "ingredientName": "Lettuce",
                        "amountInGrams": 100,
                        "_id": "67d983e1540d0684d48ba3bc"
                    }
                ],
                "preparationSteps": [
                    {
                        "stepNumber": 1,
                        "description": "Grill the chicken breast.",
                        "_id": "67d983e1540d0684d48ba3bd"
                    },
                    {
                        "stepNumber": 2,
                        "description": "Chop the lettuce.",
                        "_id": "67d983e1540d0684d48ba3be"
                    },
                    {
                        "stepNumber": 3,
                        "description": "Combine the chicken and lettuce in a bowl.",
                        "_id": "67d983e1540d0684d48ba3bf"
                    }
                ],
                "date": "2025-03-18T14:32:01.018Z",
                "createdAt": "2025-03-18T14:32:01.027Z",
                "updatedAt": "2025-03-18T14:32:01.027Z",
                "__v": 0
            },
            {
                "totalMacros": {
                    "calories": 310,
                    "protein": 14,
                    "carbs": 45,
                    "fat": 9
                },
                "_id": "67d983e1540d0684d48ba3c0",
                "mealId": 670876,
                "email": "test@example.com",
                "name": "Oatmeal",
                "mealType": "breakfast",
                "prepTime": 10,
                "foods": [
                    {
                        "name": "Oats",
                        "servingSize": 50,
                        "calories": 190,
                        "protein": 6,
                        "carbs": 33,
                        "fat": 4,
                        "_id": "67d983e1540d0684d48ba3c1"
                    },
                    {
                        "name": "Milk",
                        "servingSize": 200,
                        "calories": 120,
                        "protein": 8,
                        "carbs": 12,
                        "fat": 5,
                        "_id": "67d983e1540d0684d48ba3c2"
                    }
                ],
                "ingredients": [
                    {
                        "ingredientName": "Oats",
                        "amountInGrams": 50,
                        "_id": "67d983e1540d0684d48ba3c3"
                    },
                    {
                        "ingredientName": "Milk",
                        "amountInGrams": 200,
                        "_id": "67d983e1540d0684d48ba3c4"
                    }
                ],
                "preparationSteps": [
                    {
                        "stepNumber": 1,
                        "description": "Boil water and add oats.",
                        "_id": "67d983e1540d0684d48ba3c5"
                    },
                    {
                        "stepNumber": 2,
                        "description": "Simmer for 5-10 minutes.",
                        "_id": "67d983e1540d0684d48ba3c6"
                    },
                    {
                        "stepNumber": 3,
                        "description": "Add milk and stir.",
                        "_id": "67d983e1540d0684d48ba3c7"
                    }
                ],
                "date": "2025-03-18T14:35:01.018Z",
                "createdAt": "2025-03-18T14:35:01.027Z",
                "updatedAt": "2025-03-18T14:35:01.027Z",
                "__v": 0
            },
            {
                "totalMacros": {
                    "calories": 225,
                    "protein": 24,
                    "carbs": 20,
                    "fat": 9
                },
                "_id": "67d983e1540d0684d48ba3c8",
                "mealId": 670877,
                "email": "test@example.com",
                "name": "Veggie Stir Fry",
                "mealType": "dinner",
                "prepTime": 20,
                "foods": [
                    {
                        "name": "Broccoli",
                        "servingSize": 100,
                        "calories": 35,
                        "protein": 3,
                        "carbs": 7,
                        "fat": 0,
                        "_id": "67d983e1540d0684d48ba3c9"
                    },
                    {
                        "name": "Carrot",
                        "servingSize": 80,
                        "calories": 30,
                        "protein": 1,
                        "carbs": 7,
                        "fat": 0,
                        "_id": "67d983e1540d0684d48ba3ca"
                    },
                    {
                        "name": "Tofu",
                        "servingSize": 150,
                        "calories": 160,
                        "protein": 20,
                        "carbs": 6,
                        "fat": 9,
                        "_id": "67d983e1540d0684d48ba3cb"
                    }
                ],
                "ingredients": [
                    {
                        "ingredientName": "Broccoli",
                        "amountInGrams": 100,
                        "_id": "67d983e1540d0684d48ba3cc"
                    },
                    {
                        "ingredientName": "Carrot",
                        "amountInGrams": 80,
                        "_id": "67d983e1540d0684d48ba3cd"
                    },
                    {
                        "ingredientName": "Tofu",
                        "amountInGrams": 150,
                        "_id": "67d983e1540d0684d48ba3ce"
                    }
                ],
                "preparationSteps": [
                    {
                        "stepNumber": 1,
                        "description": "Chop the broccoli and carrots.",
                        "_id": "67d983e1540d0684d48ba3cf"
                    },
                    {
                        "stepNumber": 2,
                        "description": "Pan-fry the tofu in a bit of oil.",
                        "_id": "67d983e1540d0684d48ba3d0"
                    },
                    {
                        "stepNumber": 3,
                        "description": "Stir-fry the vegetables and tofu together.",
                        "_id": "67d983e1540d0684d48ba3d1"
                    }
                ],
                "date": "2025-03-18T14:40:01.018Z",
                "createdAt": "2025-03-18T14:40:01.027Z",
                "updatedAt": "2025-03-18T14:40:01.027Z",
                "__v": 0
            },
            {
                "totalMacros": {
                    "calories": 181,
                    "protein": 4,
                    "carbs": 38,
                    "fat": 2
                },
                "_id": "67d983e1540d0684d48ba3d2",
                "mealId": 670878,
                "email": "test@example.com",
                "name": "Fruit Smoothie",
                "mealType": "snack",
                "prepTime": 5,
                "foods": [
                    {
                        "name": "Banana",
                        "servingSize": 100,
                        "calories": 89,
                        "protein": 1,
                        "carbs": 23,
                        "fat": 0,
                        "_id": "67d983e1540d0684d48ba3d3"
                    },
                    {
                        "name": "Strawberries",
                        "servingSize": 100,
                        "calories": 32,
                        "protein": 1,
                        "carbs": 7,
                        "fat": 0,
                        "_id": "67d983e1540d0684d48ba3d4"
                    },
                    {
                        "name": "Almond Milk",
                        "servingSize": 200,
                        "calories": 60,
                        "protein": 2,
                        "carbs": 8,
                        "fat": 2,
                        "_id": "67d983e1540d0684d48ba3d5"
                    }
                ],
                "ingredients": [
                    {
                        "ingredientName": "Banana",
                        "amountInGrams": 100,
                        "_id": "67d983e1540d0684d48ba3d6"
                    },
                    {
                        "ingredientName": "Strawberries",
                        "amountInGrams": 100,
                        "_id": "67d983e1540d0684d48ba3d7"
                    },
                    {
                        "ingredientName": "Almond Milk",
                        "amountInGrams": 200,
                        "_id": "67d983e1540d0684d48ba3d8"
                    }
                ],
                "preparationSteps": [
                    {
                        "stepNumber": 1,
                        "description": "Place the banana and strawberries into the blender.",
                        "_id": "67d983e1540d0684d48ba3d9"
                    },
                    {
                        "stepNumber": 2,
                        "description": "Add the almond milk.",
                        "_id": "67d983e1540d0684d48ba3da"
                    },
                    {
                        "stepNumber": 3,
                        "description": "Blend until smooth.",
                        "_id": "67d983e1540d0684d48ba3db"
                    }
                ],
                "date": "2025-03-18T14:45:01.018Z",
                "createdAt": "2025-03-18T14:45:01.027Z",
                "updatedAt": "2025-03-18T14:45:01.027Z",
                "__v": 0
            }
        ]
    };

    // Set up state for expanded meal cards
    const [expandedMeals, setExpandedMeals] = useState({});

    // Set up state for selected meal types
    const [selectedMealTypes, setSelectedMealTypes] = useState({});

    // Toggle expanded state
    const toggleExpand = (mealId) => {
        setExpandedMeals(prev => ({
            ...prev,
            [mealId]: !prev[mealId]
        }));
    };

    // Handle meal type selection
    const handleMealTypeSelect = (mealId, mealType) => {
        setSelectedMealTypes(prev => ({
            ...prev,
            [mealId]: mealType
        }));
    };

    // Handle tracking
    const handleTrackMeal = (mealId, meal) => {
        const mealType = selectedMealTypes[mealId];
    
        if (!mealType) {
            alert("Please select a meal type before tracking!");
            return;
        }
    
        alert(`Meal ${meal} tracked as ${mealType}`);
    };
    

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.meals.map((meal) => (
                        <div
                            key={meal._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                        >
                            {/* Card Header with essential info */}
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => toggleExpand(meal._id)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{meal.name}</h2>
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide mt-1">{meal.mealType}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">{meal.prepTime} min</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-500">{meal.ingredients.length} ingredients</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm font-bold text-gray-700">{meal.totalMacros.calories} cal</span>
                                    </div>
                                    <button
                                        className="text-blue-500 hover:text-blue-700 transition-colors focus:outline-none"
                                        aria-label={expandedMeals[meal._id] ? "Collapse details" : "Expand details"}
                                    >
                                        {expandedMeals[meal._id] ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Track This Meal</h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {["breakfast", "lunch", "dinner", "snack"].map((type) => (
                                                <button
                                                    key={type}
                                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedMealTypes[meal._id] === type
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
                                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTrackMeal(meal._id, meal.name);  // ✅ Fixed: meal._id is correctly passed
                                            }}
                                        >
                                            Track Meal
                                        </button>
                                    </div>

                                    {/* Macros */}
                                    <div className="p-4 bg-blue-50 border-t border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Nutritional Information</h3>
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
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Ingredients</h3>
                                        <ul className="grid grid-cols-2 gap-2">
                                            {meal.ingredients.map((ingredient) => (
                                                <li key={ingredient._id} className="flex items-center text-gray-700 text-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {ingredient.ingredientName} ({ingredient.amountInGrams}g)
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Preparation Steps */}
                                    <div className="p-4 border-t border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Preparation</h3>
                                        <ol className="space-y-2">
                                            {meal.preparationSteps.sort((a, b) => a.stepNumber - b.stepNumber).map((step) => (
                                                <li key={step._id} className="text-gray-700 text-sm">
                                                    <span className="font-medium">Step {step.stepNumber}:</span>{" "}
                                                    {step.description}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MealPage;