import { useAuthStore } from '@/store/authStore';
import React, { useState } from 'react';

const DailyCalorieCalculator = ({ height, weight }) => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [weightGoal, setWeightGoal] = useState('maintain');
    const [result, setResult] = useState(null);
    const [proteinRatio, setProteinRatio] = useState(0.3);
    const [fatRatio, setFatRatio] = useState(0.3);
    const [carbRatio, setCarbRatio] = useState(0.4);

    const { user, upsertMacros } = useAuthStore();

    const calculateCalories = async (e) => {
        e.preventDefault();

        const calculateMacros = (totalCalories, proteinRatio = 0.3, fatRatio = 0.3, carbRatio = 0.4) => {
            // Verify ratios sum to 1.0
            if (Math.abs(proteinRatio + fatRatio + carbRatio - 1.0) > 0.01) {
                throw new Error("Macro nutrient ratios must sum to 1.0");
            }

            // Calculate calories from each macronutrient
            const proteinCalories = totalCalories * proteinRatio;
            const fatCalories = totalCalories * fatRatio;
            const carbCalories = totalCalories * carbRatio;

            // Convert calories to grams (Protein/Carbs: 4 cal/g, Fat: 9 cal/g)
            const proteinGrams = proteinCalories / 4;
            const fatGrams = fatCalories / 9;
            const carbGrams = carbCalories / 4;

            return {
                protein: Math.round(proteinGrams * 10) / 10,
                fat: Math.round(fatGrams * 10) / 10,
                carbs: Math.round(carbGrams * 10) / 10
            };
        };

        // Use the passed-in height and weight
        const heightCm = height;
        const weightKg = weight;
        const ageYears = parseInt(age);

        let bmr;
        if (gender === 'male') {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
        } else {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
        }

        // Set activity multiplier based on the selected activity level
        let activityMultiplier;
        switch (activityLevel) {
            case 'sedentary':
                activityMultiplier = 1.2;
                break;
            case 'light':
                activityMultiplier = 1.375;
                break;
            case 'moderate':
                activityMultiplier = 1.55;
                break;
            case 'active':
                activityMultiplier = 1.725;
                break;
            case 'veryActive':
                activityMultiplier = 1.9;
                break;
            default:
                activityMultiplier = 1.55;
        }

        const tdee = bmr * activityMultiplier;

        let goalCalories;
        let weeklyChange;
        switch (weightGoal) {
            case 'quickLoss':
                goalCalories = tdee - 500;
                weeklyChange = -0.5;
                break;
            case 'slowLoss':
                goalCalories = tdee - 250;
                weeklyChange = -0.25;
                break;
            case 'maintain':
                goalCalories = tdee;
                weeklyChange = 0;
                break;
            case 'slowGain':
                goalCalories = tdee + 250;
                weeklyChange = 0.25;
                break;
            case 'quickGain':
                goalCalories = tdee + 500;
                weeklyChange = 0.5;
                break;
            default:
                goalCalories = tdee;
                weeklyChange = 0;
        }

        const macros = calculateMacros(goalCalories, proteinRatio, fatRatio, carbRatio);

        try {
            await upsertMacros(
                user.email,
                Math.round(goalCalories),
                macros.protein,
                macros.carbs, // passing carbs before fat as per your requested order
                macros.fat
            );
        } catch (error) {
            console.error("Error upserting macros:", error);
        }

        setResult({
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            goalCalories: Math.round(goalCalories),
            weeklyChange,
            macros
        });
    };

    const goalDescriptions = {
        quickLoss: "Quick weight loss (approx. 0.5kg/week)",
        slowLoss: "Slow weight loss (approx. 0.25kg/week)",
        maintain: "Maintain current weight",
        slowGain: "Slow weight gain (approx. 0.25kg/week)",
        quickGain: "Quick weight gain (approx. 0.5kg/week)"
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Daily Calorie Calculator</h1>

            <form onSubmit={calculateCalories} className="space-y-4">
                {/* Display the passed-in height and weight */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Height (cm): <span className="font-medium">{height}</span>
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Weight (kg): <span className="font-medium">{weight}</span>
                    </label>
                </div>

                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age
                    </label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2"
                    />
                </div>

                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                    </label>
                    <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
                        Activity Level
                    </label>
                    <select
                        id="activity"
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2"
                    >
                        <option value="sedentary">Sedentary (little or no exercise)</option>
                        <option value="light">Light (exercise 1-3 days/week)</option>
                        <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                        <option value="active">Active (exercise 6-7 days/week)</option>
                        <option value="veryActive">Very Active (hard exercise daily)</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="weightGoal" className="block text-sm font-medium text-gray-700">
                        Weight Goal
                    </label>
                    <select
                        id="weightGoal"
                        value={weightGoal}
                        onChange={(e) => setWeightGoal(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2"
                    >
                        <option value="quickLoss">Quick weight loss (-0.5 kg/week)</option>
                        <option value="slowLoss">Slow weight loss (-0.25 kg/week)</option>
                        <option value="maintain">Maintain weight</option>
                        <option value="slowGain">Slow weight gain (+0.25 kg/week)</option>
                        <option value="quickGain">Quick weight gain (+0.5 kg/week)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Calculate Calories
                </button>
            </form>

            {result && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800">Your Results</h2>
                    <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-600">
                            Basal Metabolic Rate: <span className="font-medium">{result.bmr} calories/day</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            Maintenance Calories: <span className="font-medium">{result.tdee} calories/day</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            Goal: <span className="font-medium">{goalDescriptions[weightGoal]}</span>
                        </p>
                        <p className="text-lg text-gray-800 font-bold">
                            Recommended Daily Intake: {result.goalCalories} calories
                        </p>
                        {result.weeklyChange !== 0 && (
                            <p className="text-sm text-gray-600">
                                Expected weight change: <span className="font-medium">{result.weeklyChange > 0 ? '+' : ''}{result.weeklyChange} kg per week</span>
                            </p>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="text-md font-semibold text-gray-800">Recommended Macros</h3>
                            <div className="mt-2 space-y-1">
                                <p className="text-sm text-gray-600">
                                    Protein: <span className="font-medium">{result.macros.protein}g</span> ({Math.round(proteinRatio * 100)}%)
                                </p>
                                <p className="text-sm text-gray-600">
                                    Fat: <span className="font-medium">{result.macros.fat}g</span> ({Math.round(fatRatio * 100)}%)
                                </p>
                                <p className="text-sm text-gray-600">
                                    Carbs: <span className="font-medium">{result.macros.carbs}g</span> ({Math.round(carbRatio * 100)}%)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyCalorieCalculator;
