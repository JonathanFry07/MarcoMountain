import { Calendar, TrendingUp } from "lucide-react"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WorkoutStats() {
  return (
    <div className="flex gap-3 mb-3">
      {/* Total Workouts Card */}
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">+15% from last month</p>
        </CardContent>
      </Card>
      
      {/* Active Streak Card */}
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">7 days</div>
          <p className="text-xs text-muted-foreground">Personal best: 14 days</p>
        </CardContent>
      </Card>
    </div>
  )
}
