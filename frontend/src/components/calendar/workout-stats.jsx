import { Calendar, TrendingUp } from "lucide-react"
import React, { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/store/authStore"

function getActiveStreak(workoutHistory) {
  // Convert all workout dates to a standardized 'YYYY-MM-DD' format.
  const workoutDates = new Set(
    workoutHistory.map(event => {
      const d = new Date(event.dateCompleted);
      return d.toISOString().split('T')[0];
    })
  );

  // Use the current date as the login date.
  const loginDate = new Date();
  const loginDayStr = loginDate.toISOString().split('T')[0];

  // If there's no workout on the login day, return 0.
  if (!workoutDates.has(loginDayStr)) {
    return 0;
  }

  // Count consecutive days starting from today.
  let streak = 0;
  let currentDate = new Date(loginDate);
  while (true) {
    const formattedDate = currentDate.toISOString().split('T')[0];
    if (workoutDates.has(formattedDate)) {
      streak++;
      // Move to the previous day.
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getMonthlyWorkoutComparison(workoutHistory) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-indexed (0 = January)
  const currentYear = currentDate.getFullYear();

  // Determine last month and the corresponding year.
  let lastMonth, lastMonthYear;
  if (currentMonth === 0) {
    lastMonth = 11; // December
    lastMonthYear = currentYear - 1;
  } else {
    lastMonth = currentMonth - 1;
    lastMonthYear = currentYear;
  }

  let currentCount = 0;
  let lastCount = 0;

  workoutHistory.forEach(event => {
    const eventDate = new Date(event.dateCompleted);
    const eventMonth = eventDate.getMonth();
    const eventYear = eventDate.getFullYear();

    if (eventYear === currentYear && eventMonth === currentMonth) {
      currentCount++;
    } else if (eventYear === lastMonthYear && eventMonth === lastMonth) {
      lastCount++;
    }
  });

  return { currentCount, lastCount};
}


export function WorkoutStats() {
  const { user, getWorkoutHistory, workoutHistory } = useAuthStore();

  useEffect(() => {
    if (user && user.email) {
      getWorkoutHistory(user.email);
    }
  }, [user, getWorkoutHistory]);

  const activeStreak = getActiveStreak(workoutHistory || []);
  const { currentCount, lastCount } =
    getMonthlyWorkoutComparison(workoutHistory || []);

  return (
    <div className="flex gap-3 mb-3">
        {/* Workouts This Month Card */}
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Workouts This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{currentCount}</div>
          <p className="text-xs text-muted-foreground">{lastCount} workouts last month</p>
        </CardContent>
      </Card>
      
      {/* Active Streak Card */}
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{activeStreak} days</div>
         {/* <p className="text-xs text-muted-foreground">Personal best: 14 days</p> */}
        </CardContent>
      </Card>
    </div>
  );
}
