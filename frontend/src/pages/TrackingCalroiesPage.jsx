import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DailyCalorieCalculator from "@/components/CalorieForm";
import { useAuthStore } from "@/store/authStore";
import { Save } from "lucide-react";
import AddMealForm from "@/components/addMealForm";

const TrackingCaloriesPage = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [mealFormVisible, setMealFormVisible] = useState(false);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);

  const { user, getMarcos, marcos, setWeightHeight, getUser, userDetails, getDailyMacros, currentMacros } = useAuthStore();

  useEffect(() => {
    if (user && user.email) {
      getUser(user.email);  // Fetch user details
      getMarcos(user.email);  // Fetch macros
      getDailyMacros(user.email, new Date().toISOString().split("T")[0]);
    }
  }, [user, getUser, getDailyMacros, getMarcos]);

  useEffect(() => {
    if (userDetails && userDetails.height !== undefined && userDetails.weight !== undefined) {
      // Only update state if valid values are received
      setWeight(userDetails.weight);
      setHeight(userDetails.height);
    }
  }, [userDetails]);

  const handleWeightHeight = async () => {
    if (!weight && !height) {
      alert("Please enter Height/Weight")
    }
    else {
      await setWeightHeight(user.email, weight, height);
      getUser(user.email);
    }
  };

  const toggleFormVisible = async () => {
    await getMarcos(user.email);
    setFormVisible(!formVisible);
  }

  const closeMealForm = () => {
    setMealFormVisible(false);
  }

  return (
    <div className="p-4 space-y-6">
      <Card className="shadow-md overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Body Metrics</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Weight Input Field */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Weight</p>
              <div className="flex items-center">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-20 text-3xl font-bold text-primary focus:outline-none"
                />
                <span className="text-2xl font-medium text-muted-foreground ml-1">kg</span>
              </div>
            </div>

            {/* Height Input Field */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Height</p>
              <div className="flex items-center">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-20 text-3xl font-bold text-primary focus:outline-none"
                />
                <span className="text-2xl font-medium text-muted-foreground ml-1">cm</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between p-4 pt-0">
          <Button variant="outline" onClick={handleWeightHeight} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Metrics
          </Button>
        </CardFooter>
      </Card>

      <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" onClick={toggleFormVisible}>
        {formVisible ? "Hide Macros Calculator" : "Calculate Macros"}
      </Button>

      {formVisible ? (
        <DailyCalorieCalculator height={height} weight={weight} />
      ) : (
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">
                {currentMacros.totalCalories}/{marcos.calories}
              </p>
              <Progress
                value={(currentMacros.totalCalories / marcos.calories) * 100}
                className={currentMacros.totalCalories > marcos.calories ? 'bg-red-500' : ''}
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                {currentMacros.totalCarbs}/{marcos.carbs}
              </p>
              <Progress
                value={(currentMacros.totalCarbs / marcos.carbs) * 100}
                className={currentMacros.totalCarbs > marcos.carbs ? 'bg-red-500' : ''}
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                {currentMacros.totalProtein}/{marcos.protein}
              </p>
              <Progress
                value={(currentMacros.totalProtein / marcos.protein) * 100}
                className={currentMacros.totalProtein > marcos.protein ? 'bg-red-500' : ''}
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                {currentMacros.totalFat}/{marcos.fat}
              </p>
              <Progress
                value={(currentMacros.totalFat / marcos.fat) * 100}
                className={currentMacros.totalFat > marcos.fat ? 'bg-red-500' : ''}
              />
            </div>
          </div>


        </Card>
      )}

      {!mealFormVisible ? (
        <Card>
          <button onClick={() =>  setMealFormVisible(!mealFormVisible)}>Add Meal</button>
        </Card>) : 
        (
        <AddMealForm close={closeMealForm}/>
      )}
    </div>
  );
};

export default TrackingCaloriesPage;
