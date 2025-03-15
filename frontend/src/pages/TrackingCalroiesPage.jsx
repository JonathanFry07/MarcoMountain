import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import DailyCalorieCalculator from "@/components/CalorieForm";

const TrackingCaloriesPage = () => {
    const [fromVisible, setFormVisible] = useState(false);
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);

    return (
        <div className="p-4 space-y-6">
            <Card className="p-6 shadow-lg rounded-lg bg-white">
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">Weight</p>
                        <div className="flex items-center justify-center">
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-16 text-2xl font-bold text-black text-center border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-2xl font-bold text-black ml-1">kg</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">Height</p>
                        <div className="flex items-center justify-center">
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-16 text-2xl font-bold text-black text-center border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-2xl font-bold text-black ml-1">cm</span>
                        </div>
                    </div>
                </CardContent>
                <button
                    className="w-full mt-6 px-4 py-2 bg-cyan-500 text-white rounded-2xl hover:bg-cyan-600 transition-colors"
                    onClick={() => setFormVisible(!fromVisible)}
                >
                    Set Marcos
                </button>
            </Card>
            {fromVisible && <DailyCalorieCalculator height={height} weight={weight} />}
            <Card className="p-4">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium">Calroiess: 150/200g</p>
                        <Progress value={150 / 200 * 100} />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Carbohydrates: 150/200g</p>
                        <Progress value={150 / 200 * 100} />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Protein: 80/100g</p>
                        <Progress value={80 / 100 * 100} />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Fat: 50/70g</p>
                        <Progress value={50 / 70 * 100} />
                    </div>
                </div>
            </Card>
            <Card>
                <button onClick={() => console.log("add")}>
                    Add Meal
                </button>
            </Card>
        </div>
    );
};

export default TrackingCaloriesPage;