import React, { useState, useEffect } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight, Menu, Bed } from "lucide-react";
import { CalendarGrid } from "@/components/calendar/calendar-grix";
import { MobileSidebar } from "@/components/calendar/mobile-sidebar";
import { WorkoutStats } from "@/components/calendar/workout-stats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/authStore";

const calculateWorkoutsThisWeek = (workoutHistory) => {
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

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isLoading, getWorkoutHistory, workoutHistory, user, addRestDay } = useAuthStore();

  const workoutsThisWeek = calculateWorkoutsThisWeek(workoutHistory);

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleRestDayClick = async () => {
    await addRestDay(user.email);
    alert("Added rest day");
    getWorkoutHistory(user.email);
  };

  useEffect(() => {
    if (user && user.email) {
      getWorkoutHistory(user.email);
    }
  }, [user, getWorkoutHistory]);

  const monthYear = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center border-b px-3 bg-primary/5">
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <MobileSidebar workoutsThisWeek={workoutsThisWeek} />
            </SheetContent>
          </Sheet>

          <CalendarIcon className="h-5 w-5" />
        </div>
      </header>
      <main className="flex-1 overflow-auto p-3">
        <WorkoutStats />
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
