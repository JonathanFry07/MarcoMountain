import { useMemo } from "react"
import React from "react"
import { cn } from "@/lib/utils"

// Sample workout events data
const sampleEvents = [
  {
    id: "1",
    title: "Upper Body",
    date: new Date(2025, 2, 10),
    color: "bg-red-100 text-red-700 border-red-300",
  },
  {
    id: "2",
    title: "5K Run",
    date: new Date(2025, 2, 12),
    color: "bg-green-100 text-green-700 border-green-300",
  },
  {
    id: "3",
    title: "Yoga",
    date: new Date(2025, 2, 15),
    color: "bg-purple-100 text-purple-700 border-purple-300",
  },
  {
    id: "4",
    title: "HIIT",
    date: new Date(2025, 2, 18),
    color: "bg-amber-100 text-amber-700 border-amber-300",
  },
  {
    id: "5",
    title: "Legs",
    date: new Date(2025, 2, 20),
    color: "bg-blue-100 text-blue-700 border-blue-300",
  },
  {
    id: "6",
    title: "Rest",
    date: new Date(2025, 2, 22),
    color: "bg-slate-100 text-slate-700 border-slate-300",
  },
  {
    id: "7",
    title: "Swim",
    date: new Date(2025, 2, 25),
    color: "bg-cyan-100 text-cyan-700 border-cyan-300",
  },
  {
    id: "8",
    title: "Core",
    date: new Date(2025, 2, 28),
    color: "bg-orange-100 text-orange-700 border-orange-300",
  },
]

export function CalendarGrid({ currentDate }) {
  const { daysInMonth, firstDayOfMonth, currentMonth, currentYear } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      firstDayOfMonth: new Date(year, month, 1).getDay(),
      currentMonth: month,
      currentYear: year,
    }
  }, [currentDate])

  const today = new Date()
  const isToday = (day) => {
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear
  }

  const getEventsForDay = (day) => {
    return sampleEvents.filter((event) => {
      return (
        event.date.getDate() === day &&
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear
      )
    })
  }

  // Short weekday labels for mobile
  const weekdaysMobile = ["S", "M", "T", "W", "T", "F", "S"]

  // Create calendar grid
  const calendarDays = []

  // Previous month days
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  // Fill remaining cells if needed
  const totalCells = Math.ceil(calendarDays.length / 7) * 7
  for (let i = calendarDays.length; i < totalCells; i++) {
    calendarDays.push(null)
  }

  // Split into weeks
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
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
                        isToday(day) && "bg-primary text-primary-foreground rounded-full w-6 h-6",
                      )}
                    >
                      {day}
                    </span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {getEventsForDay(day).map((event) => (
                      <div
                        key={event.id}
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
  )
}
