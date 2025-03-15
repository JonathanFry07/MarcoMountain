import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";

export default function ExerciseHistory({ exerciseName }) {
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [workoutLimit, setWorkoutLimit] = useState("1");
  const { user, getExerciseHistoryUserName, exercises } = useAuthStore();

  // Memoized function to fetch exercise history
  const fetchHistory = useCallback(() => {
    if (user?.email) {
      getExerciseHistoryUserName(user.email, exerciseName);
    }
  }, [user?.email, exerciseName, getExerciseHistoryUserName]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Ensure exercises is always an array (prevents errors)
  const workoutData = Array.isArray(exercises) ? exercises : [];

  // Sort workouts by date (newest first)
  const sortedWorkouts = [...workoutData].sort(
    (a, b) => new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime()
  );

  // Apply limit filter
  const limitedWorkouts = sortedWorkouts.slice(0, Number.parseInt(workoutLimit));

  const toggleExpand = (date) => {
    setExpandedWorkout(expandedWorkout === date ? null : date);
  };

  return (
    <div className="w-full">
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
        {/* Show message if no workout data is available */}
        {limitedWorkouts.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">No exercise history available.</div>
        ) : (
          limitedWorkouts.map((workout, index) => (
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
                    {expandedWorkout === workout.dateCompleted ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>

              {expandedWorkout === workout.dateCompleted && (
                <CardContent className="px-3 pb-4 sm:px-6">
                  <div className="overflow-x-auto -mx-3 px-3 sm:-mx-6 sm:px-6">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          {workout.sets && workout.sets.length > 0 ? (
                            <>
                              <TableHead className="w-1/4 text-xs sm:text-sm">Set</TableHead>
                              <TableHead className="w-1/4 text-xs sm:text-sm">Weight (kg)</TableHead>
                              <TableHead className="w-1/4 text-xs sm:text-sm">Reps</TableHead>
                            </>
                          ) : workout.distance && workout.time ? (
                            <>
                              <TableHead className="w-1/2 text-xs sm:text-sm">Distance (km)</TableHead>
                              <TableHead className="w-1/2 text-xs sm:text-sm">Time (min)</TableHead>
                            </>
                          ) : (
                            <TableHead className="w-full text-xs sm:text-sm text-center">No Data</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workout.sets && workout.sets.length > 0 ? (
                          workout.sets.map((set, setIndex) => (
                            <TableRow key={setIndex}>
                              <TableCell className="py-1 text-xs sm:text-sm">{setIndex + 1}</TableCell>
                              <TableCell className="py-1 text-xs sm:text-sm">{set.weight}</TableCell>
                              <TableCell className="py-1 text-xs sm:text-sm">{set.reps}</TableCell>
                            </TableRow>
                          ))
                        ) : workout.distance && workout.time ? (
                          <TableRow>
                            <TableCell className="py-1 text-xs sm:text-sm">{workout.distance} km</TableCell>
                            <TableCell className="py-1 text-xs sm:text-sm">{workout.time} min</TableCell>
                          </TableRow>
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-2 text-xs sm:text-sm text-gray-500">
                              No data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
