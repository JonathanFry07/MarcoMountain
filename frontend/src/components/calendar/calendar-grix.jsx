import { useMemo } from "react"
import React from "react"
import { cn } from "@/lib/utils"

export function CalendarGrid({ currentDate, workoutHistory }) {

  const processedWorkoutHistory = workoutHistory.map((event) => ({
    ...event,
    date: new Date(event.dateCompleted), // Convert string to Date
    title: event.workoutTitle, // Use workoutTitle instead of title
    color: event.type === "rest"
      ? "bg-slate-300 text-slate-700 border-slate-300"
      : event.type === "weights"
        ? "bg-red-300 text-red-700 border-red-300"
        : "bg-green-300 text-green-700 border-green-300", // for other types like cardio
  }));

  const { daysInMonth, firstDayOfMonth, currentMonth, currentYear } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      firstDayOfMonth: new Date(year, month, 1).getDay(),
      currentMonth: month,
      currentYear: year,
    };
  }, [currentDate]);

  const today = new Date();
  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const getEventsForDay = (day) => {
    return processedWorkoutHistory.filter((event) => {
      return (
        event.date.getDate() === day &&
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear
      );
    });
  };

  const weekdaysMobile = ["S", "M", "T", "W", "T", "F", "S"];

  const calendarDays = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const totalCells = Math.ceil(calendarDays.length / 7) * 7;
  for (let i = calendarDays.length; i < totalCells; i++) {
    calendarDays.push(null);
  }

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-7 border-b">
        {weekdaysMobile.map((day, index) => (
          <div key={index} className="p-1 text-center font-medium border-r last:border-r-0 text-xs">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 h-[calc(100%-2rem)]">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={cn("border-r border-b p-1 h-full min-h-[60px] relative", dayIndex === 6 && "border-r-0")}
            >
              {day !== null && (
                <>
                  <div className={cn("flex justify-end", isToday(day) && "font-bold")}>
                    <span
                      className={cn(
                        "flex items-center justify-center text-xs",
                        isToday(day) && "bg-primary text-primary-foreground rounded-full w-6 h-6"
                      )}
                    >
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {getEventsForDay(day).map((event) => (
                      <div
                        key={event.email + event.dateCompleted}
                        className={cn("text-[10px] p-1 rounded border truncate cursor-pointer", event.color)}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
