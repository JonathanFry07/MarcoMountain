import React, { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { CalendarGrid } from "@/components/calendar/calendar-grix"
import { MobileSidebar } from "@/components/calendar/mobile-sidebar"
import { WorkoutStats } from "@/components/calendar/workout-stats"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigateToToday = () => {
    setCurrentDate(new Date())
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const monthYear = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

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
              <MobileSidebar />
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
            <div className="flex items-center">
              <Button variant="outline" size="sm" onClick={navigateToToday}>
                Today
              </Button>
            </div>
          </div>
          <CalendarGrid currentDate={currentDate} />
        </Card>
      </main>
    </div>
  )
}

export default CalendarPage;