import React, { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ExerciseHistory() {
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [workoutLimit, setWorkoutLimit] = useState("1");

  // Bench Press data
  const benchPressWorkouts = [
    {
      dateCompleted: "2025-03-11T15:47:40.163Z",
      sets: [
        { reps: 4, weight: 60, _id: "67d05b1cf26db0348b6884b5" },
        { reps: 4, weight: 60, _id: "67d05b1cf26db0348b6884b6" },
        { reps: 3, weight: 60, _id: "67d05b1cf26db0348b6884b7" },
      ],
    },
    {
      dateCompleted: "2025-03-11T18:48:10.270Z",
      sets: [
        { reps: 4, weight: 60, _id: "67d0856ad6cd4e222aa76384" },
        { reps: 4, weight: 60, _id: "67d0856ad6cd4e222aa76385" },
        { reps: 4, weight: 6, _id: "67d0856ad6cd4e222aa76386" },
      ],
    },
    {
      dateCompleted: "2025-02-15T10:30:00.000Z",
      sets: [
        { reps: 5, weight: 55, _id: "custom1" },
        { reps: 5, weight: 55, _id: "custom2" },
        { reps: 5, weight: 55, _id: "custom3" },
      ],
    },
    {
      dateCompleted: "2025-01-20T14:15:00.000Z",
      sets: [
        { reps: 8, weight: 50, _id: "custom4" },
        { reps: 8, weight: 50, _id: "custom5" },
        { reps: 7, weight: 50, _id: "custom6" },
      ],
    },
    {
      dateCompleted: "2024-12-05T09:20:00.000Z",
      sets: [
        { reps: 6, weight: 52.5, _id: "custom7" },
        { reps: 6, weight: 52.5, _id: "custom8" },
        { reps: 5, weight: 52.5, _id: "custom9" },
      ],
    },
  ];

  // Sort workouts by date (newest first)
  const sortedWorkouts = [...benchPressWorkouts].sort(
    (a, b) => new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime()
  );

  // Apply limit filter
  const limitedWorkouts = sortedWorkouts.slice(0, Number.parseInt(workoutLimit));

  const toggleExpand = (date) => {
    if (expandedWorkout === date) {
      setExpandedWorkout(null);
    } else {
      setExpandedWorkout(date);
    }
  };

  const calculateVolume = (workout) => {
    return workout.sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
  };

  return (
    <div className="w-full">

        {/* Set CardHeader padding to 0 so there’s no extra space around the dropdown */}
        <CardHeader className="p-1">
          <Select value={workoutLimit} onValueChange={setWorkoutLimit}>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Show workouts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last workout</SelectItem>
              <SelectItem value="3">Last 3 workouts</SelectItem>
              <SelectItem value="5">Last 5 workouts</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

      <div className="space-y-3 sm:space-y-4">
        {limitedWorkouts.map((workout, index) => (
          <Card key={index} className="shadow-sm overflow-hidden">
            <CardHeader className={`px-3 py-3 sm:px-6 sm:py-4 ${expandedWorkout === workout.dateCompleted ? "" : "pb-0"}`}>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base sm:text-lg">
                    {format(new Date(workout.dateCompleted), "MMM d, yyyy")}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {format(new Date(workout.dateCompleted), "h:mm a")}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(workout.dateCompleted)}
                  className="h-8 w-8 p-0"
                >
                  {expandedWorkout === workout.dateCompleted ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>

            {expandedWorkout === workout.dateCompleted && (
              <CardContent className="px-3 pb-4 sm:px-6">
                <div className="overflow-x-auto -mx-3 px-3 sm:-mx-6 sm:px-6">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/4 text-xs sm:text-sm">Set</TableHead>
                        <TableHead className="w-1/4 text-xs sm:text-sm">Weight (kg)</TableHead>
                        <TableHead className="w-1/4 text-xs sm:text-sm">Reps</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workout.sets.map((set, setIndex) => (
                        <TableRow key={set._id}>
                          <TableCell className="py-1 text-xs sm:text-sm">{setIndex + 1}</TableCell>
                          <TableCell className="py-1 text-xs sm:text-sm">{set.weight}</TableCell>
                          <TableCell className="py-1 text-xs sm:text-sm">{set.reps}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
