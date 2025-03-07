import React, { useEffect } from "react"
import { Dumbbell, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/authStore"
import AddWorkoutButton from "@/components/AddWorkoutButton"
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function WorkoutPage() {
  const { workouts, getWorkouts, user } = useAuthStore();
  
  useEffect(() => {
    if (user && user.email) {
      getWorkouts(user.email);
    }
  }, [user, getWorkouts]);
  

  return (
    <div className="relative h-screen flex flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="container mx-auto">
          <div className="flex flex-col space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Workouts</h1>
            <p className="text-gray-600">View and track your workout progress</p>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="bg-teal-500">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-teal-500">
                All
              </TabsTrigger>
              <TabsTrigger value="cardio" className="data-[state=active]:bg-white data-[state=active]:text-teal-500">
                Cardio
              </TabsTrigger>
              <TabsTrigger value="weights" className="data-[state=active]:bg-white data-[state=active]:text-teal-500">
                Weights
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <WorkoutList workouts={workouts} />
            </TabsContent>
            <TabsContent value="cardio">
              <WorkoutList workouts={workouts.filter((workout) => workout.type === "cardio")} />
            </TabsContent>
            <TabsContent value="weights">
              <WorkoutList workouts={workouts.filter((workout) => workout.type === "weights")} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddWorkoutButton />
    </div>
  );
}

function WorkoutList({ workouts }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} />
      ))}
    </div>
  )
}

function WorkoutCard({ workout }) {
  const navigate = useNavigate(); // Get the navigate function

  const handleTrackClick = (id) => {
    console.log("Tracking workout with ID:", id); // Logs the ID of the workout when the "Track" button is clicked
    navigate(`/tracking-workout/${id}`); // Navigate to the /trackingWorkout/:id page
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-gray-800">{workout.title}</CardTitle>
            <CardDescription className="text-gray-600">
              Last Completed: {new Date(workout.date).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge
            variant={workout.type === "cardio" ? "secondary" : "default"}
            className="bg-blue-500 text-white"
          >
            {workout.type === "cardio" ? (
              <Heart className="h-3 w-3 mr-1" />
            ) : (
              <Dumbbell className="h-3 w-3 mr-1" />
            )}
            {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium text-sm mb-2 text-gray-700">Exercises:</h3>
        <div className="space-y-2">
          {workout.exercises.length === 0 ? (
            <div className="text-sm text-gray-500">No exercises selected</div>
          ) : (
            workout.exercises.map((exercise, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-2 bg-gray-200" />}
                <ExerciseItem exercise={exercise} type={workout.type} />
              </div>
            ))
          )}
        </div>
        {/* Add Track Button */}
        <button
          onClick={() => handleTrackClick(workout.id)} // Pass the workout id to the function
          className="mt-4 w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition-colors"
        >
          Track
        </button>
      </CardContent>
    </Card>
  );
}


  function ExerciseItem({ exercise, type }) {
    if (type === "cardio") {
      return (
        <div className="text-sm">
          <div className="font-medium text-gray-800">{exercise.name}</div>
          <div className="text-gray-600 grid grid-cols-2 gap-1 mt-1">
            <div>Distance: {exercise.distance} km</div>
            {exercise.duration && <div>Duration: {exercise.duration}</div>}
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-sm">
          <div className="font-medium text-gray-800">{exercise.name}</div>
          <div className="text-gray-600 grid grid-cols-3 gap-1 mt-1">
            <div>Sets: {exercise.sets}</div>
            <div>Reps: {exercise.reps}</div>
            <div>{exercise.bodyPart}</div>
          </div>
        </div>
      );
    }
  }
  
