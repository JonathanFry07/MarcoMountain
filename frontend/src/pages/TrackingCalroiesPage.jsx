import React, { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DailyCalorieCalculator from "@/components/CalorieForm"
import { useAuthStore } from "@/store/authStore"
import { CalendarIcon, Save } from "lucide-react"
import AddMealForm from "@/components/addMealForm"
import MealTracker from "@/components/mealTracker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const TrackingCaloriesPage = () => {
  const [formVisible, setFormVisible] = useState(false)
  const [mealFormVisible, setMealFormVisible] = useState(false)
  const [weight, setWeight] = useState(0)
  const [height, setHeight] = useState(0)
  const [date, setDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("metrics")

  const { user, getMarcos, marcos, setWeightHeight, getUser, userDetails, getDailyMacros, currentMacros } =
    useAuthStore()

  useEffect(() => {
    if (user?.email) {
      getUser(user.email)
      getMarcos(user.email)
      getDailyMacros(user.email, format(date, "yyyy-MM-dd"))
    }
  }, [user, getUser, getDailyMacros, getMarcos, date])

  useEffect(() => {
    if (userDetails?.height !== undefined && userDetails?.weight !== undefined) {
      setWeight(userDetails.weight)
      setHeight(userDetails.height)
    }
  }, [userDetails])

  const handleWeightHeight = async () => {
    if (!weight || !height) {
      alert("Please enter Height/Weight")
    } else {
      await setWeightHeight(user.email, weight, height)
      getUser(user.email)
    }
  }

  const toggleFormVisible = async () => {
    await getMarcos(user.email)
    setFormVisible(!formVisible)
  }

  const closeMealForm = () => {
    setMealFormVisible(false)
    getDailyMacros(user.email, format(date, "yyyy-MM-dd"))
  }

  const handleDateChange = (newDate) => {
    setDate(newDate)
  }

  const handleDateMacros = async (newDate) => {
    await getDailyMacros(newDate);
  }

  return (
    <div className="p-4 space-y-6">
      <Tabs defaultValue="metrics" className="w-full" onValueChange={setActiveTab}>
        {/* Tabs Header */}
        <div className="bg-white border-b border-gray-200 rounded-3xl">
          <TabsList className="mx-auto flex justify-center p-2">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="mealLog">Meal Log</TabsTrigger>
          </TabsList>
        </div>

        {/* Metrics Tab */}
        <TabsContent value="metrics">
          <div className="mt-6">
            <Card className="shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Body Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Weight</p>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-20 text-3xl font-bold text-primary focus:outline-none"
                      />
                      <span className="text-2xl font-medium text-muted-foreground ml-1">kg</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Height</p>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-20 text-3xl font-bold text-primary focus:outline-none"
                      />
                      <span className="text-2xl font-medium text-muted-foreground ml-1">cm</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <Button variant="outline" onClick={handleWeightHeight} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Metrics
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white mt-6" onClick={toggleFormVisible}>
            {formVisible ? "Hide Macros Calculator" : "Calculate Macros"}
          </Button>

          <div className="pt-4 flex justify-center mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {formVisible ? (
            <DailyCalorieCalculator height={height} weight={weight} />
          ) : currentMacros?.macros ? (
            <Card className="p-4 mt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">
                    Calories
                    <br />
                    {Math.round(currentMacros.macros.totalCalories)}/{Math.round(marcos?.calories || 1)}
                  </p>
                  <Progress value={Math.round((currentMacros.macros.totalCalories / (marcos?.calories || 1)) * 100)} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Carbohydrates
                    <br />
                    {Math.round(currentMacros.macros.totalCarbs)}/{Math.round(marcos?.carbs || 1)}
                  </p>
                  <Progress value={Math.round((currentMacros.macros.totalCarbs / (marcos?.carbs || 1)) * 100)} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Protein
                    <br />
                    {Math.round(currentMacros.macros.totalProtein)}/{Math.round(marcos?.protein || 1)}
                  </p>
                  <Progress value={Math.round((currentMacros.macros.totalProtein / (marcos?.protein || 1)) * 100)} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Fat
                    <br />
                    {Math.round(currentMacros.macros.totalFat)}/{Math.round(marcos?.fat || 1)}
                  </p>
                  <Progress value={Math.round((currentMacros.macros.totalFat / (marcos?.fat || 1)) * 100)} />
                </div>
              </div>
            </Card>
          ) : (
            <p>Loading macros...</p>
          )}
        </TabsContent>

        {/* Meal Log Tab */}
        <TabsContent value="mealLog">
          {/* Date Selector */}
          <div className="flex justify-center mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {!mealFormVisible ? (
            <Card className="p-4">
              <Button className="bg-cyan-500" onClick={() => setMealFormVisible(true)}>
                Add Meal
              </Button>
            </Card>
          ) : (
            <AddMealForm close={closeMealForm} selectedDate={format(date, "yyyy-MM-dd")} />
          )}

          {/* Meal Tracker is only visible when mealFormVisible is false */}
          {!mealFormVisible && (
            <div>
              <MealTracker meals={currentMacros?.meals || []} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TrackingCaloriesPage

