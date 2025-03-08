import React from "react";
import { Dumbbell, Flame, Heart, MonitorIcon as Running } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MobileSidebar() {
  const workoutTypes = [
    { id: "1", name: "Strength Training", color: "bg-red-500", icon: <Dumbbell className="h-4 w-4" /> },
    { id: "2", name: "Cardio", color: "bg-green-500", icon: <Running className="h-4 w-4" /> },
    { id: "4", name: "HIIT", color: "bg-amber-500", icon: <Flame className="h-4 w-4" /> },
    { id: "5", name: "Rest Days", color: "bg-slate-500", icon: <Heart className="h-4 w-4" /> },
  ]

  return (
    <div className="h-full py-4 px-4 overflow-auto">
      <div className="mb-6 space-y-4">
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          <h3 className="font-medium mb-2">Weekly Progress</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Workouts: 4/5</span>
                <span>80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>

            <div className="pt-2">
              <label className="text-xs font-medium mb-1 block">Set Weekly Goal</label>
              <Select defaultValue="5">
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 workouts per week</SelectItem>
                  <SelectItem value="4">4 workouts per week</SelectItem>
                  <SelectItem value="5">5 workouts per week</SelectItem>
                  <SelectItem value="6">6 workouts per week</SelectItem>
                  <SelectItem value="7">7 workouts per week</SelectItem>
                </SelectContent>
              </Select>
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
              <Checkbox id={`mobile-workout-${workout.id}`} defaultChecked className="h-5 w-5" />
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
  )
}

