import { useMemo, useState } from "react"
import React from "react"
import { cn } from "@/lib/utils"

export function CalendarGrid({ currentDate, workoutHistory }) {
  const [selectedDay, setSelectedDay] = useState(null); // State to track selected day
  const [modalOpen, setModalOpen] = useState(false); // State to handle modal visibility

  const processedWorkoutHistory = workoutHistory.map((event) => ({
    ...event,
    date: new Date(event.dateCompleted),
    title: event.workoutTitle,
    color:
      event.type === "rest"
        ? "bg-slate-300 text-slate-700 border-slate-300"
        : event.type === "weights"
        ? "bg-red-300 text-red-700 border-red-300"
        : "bg-green-300 text-green-700 border-green-300",
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
  const isToday = (day) =>
    today.getDate() === day &&
    today.getMonth() === currentMonth &&
    today.getFullYear() === currentYear;

  const getEventsForDay = (day) => {
    return processedWorkoutHistory.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear
    );
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

  const handleDayClick = (day) => {
    setSelectedDay(day); // Set the selected day
    setModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setModalOpen(false); // Close the modal
    setSelectedDay(null); // Reset selected day
  };

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-7 border-b">
        {weekdaysMobile.map((day, index) => (
          <div
            key={index}
            className="p-2 text-center font-medium border-r last:border-r-0 text-xs"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 h-[calc(100%-2rem)]">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={cn(
                "border-r border-b p-2 h-full min-h-[80px] relative",
                dayIndex === 6 && "border-r-0"
              )}
            >
              {day !== null && (
                <>
                  <div
                    className={cn("flex justify-end", isToday(day) && "font-bold")}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center text-xs",
                        isToday(day) &&
                          "bg-primary text-primary-foreground rounded-full w-8 h-8"
                      )}
                    >
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1 mt-1 h-full flex flex-col overflow-hidden">
                    {getEventsForDay(day).length > 0 && (
                      <div className="flex flex-col space-y-1 flex-grow overflow-auto">
                        {getEventsForDay(day).slice(0, 1).map((event, index) => (
                          <div
                            key={`${event.email}-${event.dateCompleted}-${index}`}
                            className={cn(
                              "text-[10px] p-1 rounded border truncate cursor-pointer",
                              event.color
                            )}
                            onClick={() => handleDayClick(day)} // Handle click on day
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    )}
                    {getEventsForDay(day).length > 3 && (
                      <div className="text-xs text-center text-gray-500 mt-1">
                        +{getEventsForDay(day).length - 1} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal to display workout details */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] sm:w-[400px] max-h-[80%] overflow-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Workouts on {selectedDay}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                X
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {getEventsForDay(selectedDay).map((event, index) => (
                <div
                  key={`${event.email}-${event.dateCompleted}-${index}`}
                  className={cn("text-[14px] p-2 rounded border", event.color)}
                >
                  <p>{event.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}