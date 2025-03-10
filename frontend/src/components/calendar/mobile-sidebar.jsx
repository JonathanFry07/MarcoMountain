import React, { useState, useEffect } from "react";
import { Dumbbell, Flame, Heart, MonitorIcon as Running } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";

export function MobileSidebar({ workoutsThisWeek }) {
  console.log(workoutsThisWeek)
  const { user, setWorkoutTarget } = useAuthStore();
  const workoutTypes = [
    { id: "1", name: "Strength Training", color: "bg-red-500", icon: <Dumbbell className="h-4 w-4" /> },
    { id: "2", name: "Cardio", color: "bg-green-500", icon: <Running className="h-4 w-4" /> },
    //{ id: "4", name: "HIIT", color: "bg-amber-500", icon: <Flame className="h-4 w-4" /> },  {/* Added HIIT workout type */}
    { id: "5", name: "Rest Days", color: "bg-slate-500", icon: <Heart className="h-4 w-4" /> },
  ];

  // Set the initial goal state from user data
  const [goal, setGoal] = useState(user?.workoutTarget || 4);

  // Calculate progress only if workoutsThisWeek is not zero and goal is greater than 0
  const progress = (workoutsThisWeek && goal > 0) 
    ? Math.round((workoutsThisWeek / goal) * 100) 
    : 0; // If no workouts or invalid goal, set progress to 0

  // Update goal when user.workoutTarget changes
  useEffect(() => {
    if (user?.workoutTarget) {
      setGoal(user.workoutTarget);  // Update goal if user.workoutTarget is available
    }
  }, [user?.workoutTarget]); // This hook runs when user.workoutTarget is updated

  const setNewGoal = async () => {
    await setWorkoutTarget(user.email, goal); // Set the new workout target in the store
    alert('New target set');
  };

  return (
    <div className="h-full py-4 px-4 overflow-auto">
      <div className="mb-6 space-y-4">
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <h3 className="font-medium mb-2">Weekly Progress</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Workouts: {workoutsThisWeek}/{goal}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="pt-2">
              <label className="text-xs font-medium mb-1 block">Set Weekly Goal</label>
              <Select value={goal.toString()} onValueChange={(value) => setGoal(Number(value))}>
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num} workouts per week</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <button onClick={setNewGoal}>Set new goal</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Workout Types</h3>
        </div>
        <div className="space-y-3">
          {workoutTypes.map((workout) => (
            <div key={workout.id} className="flex items-center space-x-3">
              {/* Set checked to true for all checkboxes by default */}
              <Checkbox
                id={`mobile-workout-${workout.id}`}
                checked={true} // Check all checkboxes by default
                onChange={() => setWorkoutTarget(user.email, workout.id)} // Update the workout target when checkbox is clicked
                className="h-5 w-5"
              />
              <div className={`h-4 w-4 rounded-full ${workout.color}`} />
              <div className="flex items-center">
                {workout.icon}
                <label
                  htmlFor={`mobile-workout-${workout.id}`}
                  className="ml-2 text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {workout.name}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
