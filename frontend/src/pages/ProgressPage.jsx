import React, { useEffect, useState } from "react";
import { Dumbbell, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import WeightProgress from "@/components/progress/weightProgress";
import VolumeProgress from "@/components/progress/volumeProgress";
import RepRangeAnalysis from "@/components/progress/repRange";
import { format } from "date-fns";
import PaceAnalysis from "@/components/progress/paceAnalysis";
import DistanceAnalysis from "@/components/progress/distanceAnalysis";

function ProgressPage() {
  const { user, exerciseHistory, getExerciseHistory } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [latestTime, setLatestTime] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user && user.email) {
        await getExerciseHistory(user.email);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, getExerciseHistory]);

  useEffect(() => {
    if (exerciseHistory && exerciseHistory.length > 0) {
      const latestSession = exerciseHistory.reduce((latest, session) => {
        const currentDate = new Date(session.dateCompleted);
        return currentDate > latest ? currentDate : latest;
      }, new Date(0));

      const latestTimeString = format(latestSession, "MMM dd, yyyy, HH:mm");
      setLatestTime(latestTimeString);
    }
  }, [exerciseHistory]);

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        <div className="container py-6 sm:py-8 mx-auto">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-8 bg-white shadow-sm rounded-lg">
            <h2 className="text-3xl font-semibold text-cyan-500 tracking-tight sm:text-4xl">
              Exercise Analytics
            </h2>
            <div className="flex items-center gap-2 mt-3 sm:mt-0 text-sm sm:text-base text-gray-600">
              <span className="text-cyan-400 font-medium">Last updated:</span>
              <span className="text-cyan-600 font-semibold">{latestTime || "Loading..."}</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <Tabs defaultValue="strength" className="w-full">
            <TabsList className="grid w-full bg-white max-w-md mx-auto grid-cols-2 border-b">
              <TabsTrigger value="strength" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                <span>Strength Training</span>
              </TabsTrigger>
              <TabsTrigger value="cardio" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Cardio Training</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="strength" className="mt-4 space-y-4">
              {loading ? (
                <div className="text-center text-cyan-500 font-semibold">Loading analysis...</div>
              ) : (
                <>
                  <div className="grid gap-4 bg-white p-2">
                    <h2 className="text-xl font-semibold text-cyan-600">Weight Progress</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <WeightProgress data={exerciseHistory} />
                    </div>
                  </div>

                  <div className="grid gap-4 bg-white p-2">
                    <h2 className="text-xl font-semibold text-cyan-600">Rep Range Analysis</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <RepRangeAnalysis data={exerciseHistory} />
                    </div>
                  </div>

                  <div className="grid gap-4 bg-white p-2">
                    <h2 className="text-xl font-semibold text-cyan-600">Volume Analysis</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <VolumeProgress data={exerciseHistory} />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>


            <TabsContent value="cardio" className="mt-6">
              <div className="grid gap-4 bg-white p-2">
                <h2 className="text-xl font-semibold text-cyan-600">Pace Analysis (Minutes per Kilometer)</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <PaceAnalysis data={exerciseHistory} />
                </div>
              </div>

              <div className="grid gap-4 bg-white p-2">
                <h2 className="text-xl font-semibold text-cyan-600">Distance Analysis (km)</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <DistanceAnalysis data={exerciseHistory} />
                </div>
              </div>

            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default ProgressPage;
