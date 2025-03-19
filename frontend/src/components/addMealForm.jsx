import React, { useState, useEffect } from 'react';
import { Search, StepBack } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import MealTracker from './mealTracker';
import FoodForm from './addFoodForm';

const AddMealForm = ({ close }) => {
    // Form states
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [quantity, setQuantity] = useState(100);
    const [FoodFormVisibility, setFoodFormVisibility ] = useState(true)

    const { nutrition, getNutrition, isLoading, user, postMeal } = useAuthStore();

    useEffect(() => {
        getNutrition();
    }, [getNutrition]);

    const [mealType, setMealType] = useState('breakfast');
    const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
    const [mealFoods, setMealFoods] = useState([]);
    const [totalMacros, setTotalMacros] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });
    const [mealName, setMealName] = useState('');

    const parseNutritionValue = (value) => {
        if (typeof value === 'string') {
            const match = value.match(/(\d+(\.\d+)?)/);
            return match ? parseFloat(match[0]) : 0;
        }
        return value;
    };

    const formatNutritionData = (item) => {
        return {
            id: item.food,
            name: item.food,
            calories: parseNutritionValue(item.calories),
            protein: parseNutritionValue(item.protein),
            carbs: parseNutritionValue(item.carbs),
            fat: parseNutritionValue(item.fat)
        };
    };

    // Update total macros whenever meal foods change
    useEffect(() => {
        const newTotalMacros = mealFoods.reduce((acc, food) => {
            return {
                calories: acc.calories + food.calories,
                protein: acc.protein + food.protein,
                carbs: acc.carbs + food.carbs,
                fat: acc.fat + food.fat
            };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        setTotalMacros(newTotalMacros);
    }, [mealFoods]);

    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        setIsSearching(true);

        // Only search if term is not empty
        if (term.trim() === '') {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        // Filter the nutrition data based on the search term
        const results = (Array.isArray(nutrition) ? nutrition : [])
            .filter(food => food.food.toLowerCase().includes(term.toLowerCase()))
            .map(formatNutritionData)
            .slice(0, 5);  // Take only the first 5 results

        setSearchResults(results);
        setIsSearching(false);
    };

    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setSearchTerm(food.name);
        setSearchResults([]);
    };

    const handleQuantityChange = (event) => {
        const value = event.target.value;

        if (value === "") {
            setQuantity(""); // Allow clearing input
        } else if (!isNaN(value) && Number(value) >= 0) {
            setQuantity(Number(value)); // Convert to number before setting state
        }
    };

    const handleAddFood = () => {
        if (!selectedFood) return;

        // Calculate macros based on quantity
        const multiplier = quantity / 100;
        const foodItem = {
            name: selectedFood.name,
            servingSize: quantity,
            servingUnit: 'g',
            calories: Math.round(selectedFood.calories * multiplier * 10) / 10,
            protein: Math.round(selectedFood.protein * multiplier * 10) / 10,
            carbs: Math.round(selectedFood.carbs * multiplier * 10) / 10,
            fat: Math.round(selectedFood.fat * multiplier * 10) / 10
        };

        // Add to meal foods array
        setMealFoods([...mealFoods, foodItem]);

        // Reset food selection
        setSelectedFood(null);
        setSearchTerm('');
        setQuantity(100);
        
    };

    const handleRemoveFood = (index) => {
        const newFoods = [...mealFoods];
        newFoods.splice(index, 1);
        setMealFoods(newFoods);
    };

    const handleSaveMeal = async () => {
        if (mealFoods.length === 0) return;

        // Create meal object matching Mongoose schema
        const meal = {
            mealId: Math.floor(Math.random() * 10000),
            email: user.email,
            date: new Date(mealDate),
            mealType,
            foods: mealFoods,
            totalMacros,
            mealName // Include the meal name here
        };

        // Post meal with the meal name as the second argument
        await postMeal(user.email, mealName, mealType, mealFoods, totalMacros);
        console.log('Meal to be saved:', meal);
        close();
    };

    const toggleVisibility = () => {
        setFoodFormVisibility(!FoodFormVisibility)
    }

    return (
        <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <button onClick={close} className="mr-2">
                    <StepBack size={20} />
                </button>
                <h2 className="text-xl font-bold">Create a Meal</h2>
            </div>
    
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Meal Details</h3>
    
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meal Name
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Enter meal name"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                    />
                </div>
    
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meal Type
                        </label>
                        <select
                            className="w-full p-2 text-lg border border-gray-300 rounded-lg"
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value)}
                        >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                        </select>
                    </div>
    
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            className="w-full p-2 text-lg border border-gray-300 rounded-lg"
                            value={mealDate}
                            onChange={(e) => setMealDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>
    
            <div className="flex justify-center items-center p-2">
                {/* Button to toggle the FoodForm visibility */}
                <button
                    className="bg-gradient-to-br from-cyan-400 to-cyan-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transition-all"
                    onClick={() => setFoodFormVisibility(!FoodFormVisibility)} // Toggle visibility on click
                >
                    Add new Food
                </button>
            </div>
    
            {/* Conditional rendering of the Food Form or Search Food */}
            {FoodFormVisibility ? (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Add Foods</h3>
    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Food
                        </label>
                        <div className="relative">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <div className="pl-3">
                                    <Search className="text-gray-400" size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search foods..."
                                    className="w-full p-3 outline-none"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
    
                            {isLoading && (
                                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg z-10 p-2 text-center text-gray-500">
                                    Loading foods...
                                </div>
                            )}
    
                            {isSearching && (
                                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg z-10 p-2 text-center text-gray-500">
                                    Searching...
                                </div>
                            )}
    
                            {searchTerm && !isSearching && searchResults.length === 0 && !selectedFood && (
                                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg z-10 p-2 text-center text-gray-500">
                                    No foods found
                                </div>
                            )}
    
                            {isLoading ? (
                                <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg z-10 p-2 text-center text-gray-500">
                                    Loading foods...
                                </div>
                            ) : (
                                searchResults.length > 0 && (
                                    <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg z-10 max-h-60 overflow-y-auto">
                                        {searchResults.map(food => (
                                            <div
                                                key={food.id}
                                                className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleSelectFood(food)}
                                            >
                                                <div className="font-medium">{food.name}</div>
                                                <div className="flex gap-4 mt-1 text-sm">
                                                    <span className="text-gray-700">{food.calories} cal</span>
                                                    <span className="text-gray-700">{food.protein}g protein</span>
                                                    <span className="text-gray-700">{food.carbs}g carbs</span>
                                                    <span className="text-gray-700">{food.fat}g fat</span>
                                                </div>
                                                <div className="text-xs text-gray-500">per 100g</div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                // If FoodFormVisibility is false, show the FoodForm component
                <FoodForm close={toggleVisibility}/>
            )}
    
            {/* Show the selected food details */}
            {selectedFood && (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity (grams)
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                    </div>
    
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Nutrition Values</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                                <span>Calories:</span>
                                <span className="font-medium">{(selectedFood.calories * quantity / 100).toFixed(1)} cal</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Protein:</span>
                                <span className="font-medium">{(selectedFood.protein * quantity / 100).toFixed(1)}g</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Carbs:</span>
                                <span className="font-medium">{(selectedFood.carbs * quantity / 100).toFixed(1)}g</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Fat:</span>
                                <span className="font-medium">{(selectedFood.fat * quantity / 100).toFixed(1)}g</span>
                            </div>
                        </div>
                    </div>
    
                    <button
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        onClick={handleAddFood}
                    >
                        Add Food
                    </button>
                </>
            )}
    
            {/* Foods List */}
            {mealFoods.length > 0 && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Added Foods</h3>
    
                    <div className="space-y-2 mb-4">
                        {mealFoods.map((food, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <div>
                                    <div className="font-medium">{food.name}</div>
                                    <div className="text-sm text-gray-600">{food.servingSize}g</div>
                                </div>
                                <div className="text-sm">
                                    <div>{food.calories} cal</div>
                                    <div className="flex gap-2">
                                        <span>P: {food.protein}g</span>
                                        <span>C: {food.carbs}g</span>
                                        <span>F: {food.fat}g</span>
                                    </div>
                                </div>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleRemoveFood(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
    
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <h3 className="font-medium mb-2">Total Nutrition</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex justify-between">
                                <span>Calories:</span>
                                <span className="font-medium">{totalMacros.calories.toFixed(1)} cal</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Protein:</span>
                                <span className="font-medium">{totalMacros.protein.toFixed(1)}g</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Carbs:</span>
                                <span className="font-medium">{totalMacros.carbs.toFixed(1)}g</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Fat:</span>
                                <span className="font-medium">{totalMacros.fat.toFixed(1)}g</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Save Meal Button */}
            <button
                className="w-full bg-gradient-to-br from-green-400 to-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300"
                disabled={mealFoods.length === 0}
                onClick={handleSaveMeal}
            >
                Save Meal
            </button>
        </div>
    );
    
}

export default AddMealForm;
