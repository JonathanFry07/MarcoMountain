import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MealTracker = ({ meals = [] }) => {
    // Ensure meals is an array
    const allMeals = meals;

    // Categorize meals by type
    const mealCategories = {
        breakfast: allMeals.filter((meal) => meal.mealType?.toLowerCase() === "breakfast"),
        lunch: allMeals.filter((meal) => meal.mealType?.toLowerCase() === "lunch"),
        dinner: allMeals.filter((meal) => meal.mealType?.toLowerCase() === "dinner"),
        snack: allMeals.filter((meal) => meal.mealType?.toLowerCase() === "snack"),
    };

    // Helper function to render meals
    const renderMeals = (mealArray) => {
        if (mealArray.length === 0) return null; // Don't render anything if no meals

        return mealArray.map((meal, index) => (
            <Card key={`${meal.name}-${meal.date}-${index}`} className="mb-6 shadow-md rounded-lg border border-gray-200">
                <CardHeader className="bg-gray-100 px-4 py-2 rounded-t-lg">
                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">{meal.name}</CardTitle>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mt-0">{meal.mealType}</p>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md">
                            Calories: <strong>{meal.totalMacros.calories}kcal</strong>
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md">
                            Protein: <strong>{meal.totalMacros.protein}g</strong>
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md">
                            Carbs: <strong>{meal.totalMacros.carbs}g</strong>
                        </span>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-md">
                            Fat: <strong>{meal.totalMacros.fat}g</strong>
                        </span>
                    </div>

                    {meal.foods && meal.foods.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-800 mb-2">Ingredients:</p>
                            <ul className="list-none space-y-1">
                                {meal.foods.map((food) => (
                                    <li key={food._id} className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-md shadow-sm">
                                        <strong>{food.name}</strong> – {food.servingSize}
                                        {food.servingUnit} ({food.calories} cal, {food.protein}g protein, {food.carbs}g carbs, {food.fat}g fats)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        ));
    };

    return (
        <div className="container bg-white max-w-md mx-auto px-4 py-6">
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="flex justify-around mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                    <TabsTrigger value="lunch">Lunch</TabsTrigger>
                    <TabsTrigger value="dinner">Dinner</TabsTrigger>
                    <TabsTrigger value="snack">Snack</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    {renderMeals(mealCategories.breakfast)}
                    {renderMeals(mealCategories.lunch)}
                    {renderMeals(mealCategories.dinner)}
                    {renderMeals(mealCategories.snack)}
                </TabsContent>

                <TabsContent value="breakfast">{renderMeals(mealCategories.breakfast)}</TabsContent>
                <TabsContent value="lunch">{renderMeals(mealCategories.lunch)}</TabsContent>
                <TabsContent value="dinner">{renderMeals(mealCategories.dinner)}</TabsContent>
                <TabsContent value="snack">{renderMeals(mealCategories.snack)}</TabsContent>
            </Tabs>
        </div>
    );
};

export default MealTracker;
