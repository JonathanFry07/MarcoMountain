// src/ProgressPage.js
import React, { useEffect} from "react";
import { Dumbbell, Heart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/store/authStore";
import WeightProgress from "@/components/progress/weightProgress";
import VolumeProgress from "@/components/progress/volumeProgress";
import RepRangeAnalysis from "@/components/progress/repRange";

function ProgressPage() {

  const { user, exerciseHistory, getExerciseHistory } = useAuthStore();

  return (
   <>
    <div className="flex min-h-screen flex-col">
        <div className="container py-4 sm:py-6">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Exercise Analytics</h2>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <span className="text-xs sm:text-sm text-muted-foreground">Last updated: Today, 2:30 PM</span>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
              <Tabs defaultValue="strength" className="w-full">
                <TabsList className="grid w-full bg-white max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="strength" className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    <span>Strength Training</span>
                  </TabsTrigger>
                  <TabsTrigger value="cardio" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Cardio Training</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="strength" className="mt-6 space-y-6">
                  <div className="grid gap-6 bg-white p-2">
                    <h2 className="text-xl font-semibold">Weight Progress</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <WeightProgress />
                    </div>
                  </div>

                  <div className="grid gap-6 bg-white p-2">
                    <h2 className="text-xl font-semibold">Volume Analysis</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                     <VolumeProgress />
                    </div>
                  </div>

                  <div className="grid gap-6 bg-white p-2">
                    <h2 className="text-xl font-semibold">Rep Range Analysis</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                     <RepRangeAnalysis />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cardio" className="mt-6">
                <div className="grid gap-6">
                    <h2 className="text-xl font-semibold">Cardio</h2>
                  </div>
                </TabsContent>
              </Tabs>
          </div>
        </div>
    </div>
   </>
  );
}

export default ProgressPage;
