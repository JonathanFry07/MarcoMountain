import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Bed } from "lucide-react";
import { CalendarGrid } from "@/components/calendar/calendar-grix";
import { WorkoutStats } from "@/components/calendar/workout-stats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isLoading, getWorkoutHistory, workoutHistory, user, addRestDay, setWorkoutTarget } = useAuthStore();
  const [goal, setGoal] = useState(user?.workoutTarget || 4);  // Default goal value

  // Calculate the workouts completed this week
  const calculateWorkoutsThisWeek = () => {
    const today = new Date();
    const startOfWeek = today.getDate() - today.getDay();
    const endOfWeek = startOfWeek + 6;

    const weekStartDate = new Date(today.setDate(startOfWeek));
    const weekEndDate = new Date(today.setDate(endOfWeek));

    const workoutsThisWeek = workoutHistory.filter((workout) => {
      const workoutDate = new Date(workout.dateCompleted);
      return workoutDate >= weekStartDate && workoutDate <= weekEndDate;
    });

    return workoutsThisWeek.length;
  };

  const workoutsThisWeek = calculateWorkoutsThisWeek();

  // Calculate the progress percentage
  const progress = (workoutsThisWeek && goal > 0)
    ? Math.round((workoutsThisWeek / goal) * 100)
    : 0;

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const setNewGoal = async () => {
    if (user?.email) {
      await setWorkoutTarget(user.email, goal); // Set the new workout target in the store
      alert("New target set");
    }
  };

  const handleRestDayClick = async () => {
    if (user?.email) {
      await addRestDay(user.email);
      alert("Added rest day");
      getWorkoutHistory(user.email);
    }
  };

  useEffect(() => {
    if (user && user.email) {
      getWorkoutHistory(user.email);
    }
  }, [user, getWorkoutHistory]);

  useEffect(() => {
    if (user?.workoutTarget) {
      setGoal(user.workoutTarget);  // Update goal if user.workoutTarget is available
    }
  }, [user?.workoutTarget]);

  const monthYear = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-auto p-3">
        <WorkoutStats />
        <div className="space-y-4 p-2">
          {/* Workouts progress section */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Workouts: {workoutsThisWeek}/{goal}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 rounded-full" />
          </div>

          {/* Weekly goal section */}
          <div className="pt-2">
            <label className="text-xs font-medium text-gray-700 mb-1 block">Set Weekly Goal</label>
            <Select value={goal.toString()} onValueChange={(value) => setGoal(Number(value))}>
              <SelectTrigger className="w-full h-9 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-md shadow-lg">
                {[3, 4, 5, 6, 7].map((num) => (
                  <SelectItem key={num} value={num.toString()} className="hover:bg-gray-100">
                    {num} workouts per week
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Set new goal button */}
          <div>
            <button
              onClick={setNewGoal}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Set new goal
            </button>
          </div>
        </div>


        <Card className="h-[calc(100%-100px)] overflow-hidden">
          <div className="flex items-center justify-between border-b p-2">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-base font-medium">{monthYear}</h2>
              <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="btn flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-md transition">
              <Bed className="w-5 h-5" onClick={handleRestDayClick} />
            </div>
            <div className="flex items-center">
              <Button variant="outline" size="sm" onClick={navigateToToday}>
                Today
              </Button>
            </div>
          </div>

          <CalendarGrid currentDate={currentDate} workoutHistory={workoutHistory} />
        </Card>
      </main>
    </div>
  );
};

export default CalendarPage;
