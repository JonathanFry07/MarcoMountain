import React, { useState } from 'react';
import { Heart, MessageSquare, Zap, Dumbbell, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Tooltip } from './ui/tooltip';

const SocialFeed = () => {
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      user: {
        name: 'Alex Johnson',
        isPremium: true
      },
      workoutType: 'cardio',
      activity: 'Running',
      title: 'Morning Run',
      distance: 8.2,
      duration: '45:22',
      pace: '5:32/km',
      date: 'Today at 7:30 AM',
      description: 'Great morning run! Felt strong throughout despite the hills.',
      kudos: 24,
      comments: 3,
    },
    {
      id: 2,
      user: {
        name: 'Sam Wilson',
        isPremium: false
      },
      workoutType: 'strength',
      activity: 'Upper Body',
      title: 'Chest & Back Day',
      exercises: [
        { name: 'Bench Press', sets: '4', reps: '8-10', weight: '80kg' },
        { name: 'Pull-ups', sets: '3', reps: '10', weight: 'Bodyweight' },
        { name: 'Incline DB Press', sets: '3', reps: '12', weight: '22kg' }
      ],
      duration: '58:10',
      date: 'Yesterday at 6:15 PM',
      description: 'New PR on bench press! Training for that summer body.',
      kudos: 18,
      comments: 5,
    },
    {
      id: 3,
      user: {
        name: 'Jamie Rivera',
        isPremium: true
      },
      workoutType: 'cardio',
      activity: 'Cycling',
      title: 'Weekend Long Ride',
      distance: 42.5,
      duration: '2:15:43',
      pace: '18.8km/h',
      date: 'Saturday at 8:45 AM',
      description: 'Beautiful scenery today! Pushed hard on the climbs.',
      kudos: 37,
      comments: 8,
    }
  ]);

  const [likedWorkouts, setLikedWorkouts] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLike = (id) => {
    if (likedWorkouts.includes(id)) {
      setLikedWorkouts(likedWorkouts.filter(workoutId => workoutId !== id));
      setWorkouts(workouts.map(workout => 
        workout.id === id ? {...workout, kudos: workout.kudos - 1} : workout
      ));
    } else {
      setLikedWorkouts([...likedWorkouts, id]);
      setWorkouts(workouts.map(workout => 
        workout.id === id ? {...workout, kudos: workout.kudos + 1} : workout
      ));
    }
  };

  // Generate initials for user avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-50 min-h-screen relative">
      
      {/* Feed */}
      <div className="pt-2 pb-20">
        {workouts.map(workout => (
          <Card key={workout.id} className="mb-3 shadow-sm">
            {/* Workout header */}
            <div className="p-3 flex items-center">
              {/* User avatar with initials */}
              <Avatar className="h-10 w-10 bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold">
                {getInitials(workout.user.name)}
              </Avatar>
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900">{workout.user.name}</span>
                </div>
                <div className="flex items-center text-gray-500 text-xs">
                  <span>{workout.date}</span>
                </div>
              </div>
            </div>
            
            {/* Workout title & type */}
            <div className="px-3 pb-2">
              <div className="flex items-center mb-1">
                {workout.workoutType === 'cardio' ? (
                  <Zap className="h-4 w-4 text-blue-500 mr-1 flex-shrink-0" />
                ) : (
                  <Dumbbell className="h-4 w-4 text-purple-500 mr-1 flex-shrink-0" />
                )}
                <span className="font-medium text-gray-700 text-sm">{workout.activity}</span>
                <span className="mx-1 text-gray-400">•</span>
                <span className="font-bold text-gray-900 truncate">{workout.title}</span>
              </div>
            </div>
            
            {/* Workout stats */}
            <div className="px-3 pb-3">
              <div className="bg-gray-50 p-2 rounded-lg grid grid-cols-2 gap-2">
                {workout.workoutType === 'cardio' ? (
                  <>
                    <div>
                      <div className="text-xs text-gray-500">Distance</div>
                      <div className="font-semibold text-sm">{workout.distance} km</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Time</div>
                      <div className="font-semibold text-sm">{workout.duration}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Pace</div>
                      <div className="font-semibold text-sm">{workout.pace}</div>
                    </div>
                  </>
                ) : (
                  workout.exercises.map((exercise, index) => (
                    <div key={index}>
                      <div className="text-xs text-gray-500">{exercise.name}</div>
                      <div className="font-semibold text-sm">{exercise.sets} sets x {exercise.reps} reps</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Description */}
            <div className="px-3 pb-3">
              <p className="text-gray-800 text-sm">{workout.description}</p>
            </div>
            
            {/* Social interaction */}
            <div className="px-3 py-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Tooltip content={likedWorkouts.includes(workout.id) ? 'Unlike' : 'Like'}>
                    <Button 
                      variant="outline" 
                      color={likedWorkouts.includes(workout.id) ? 'danger' : 'gray'}
                      onClick={() => handleLike(workout.id)}
                    >
                      <Heart className="h-5 w-5" />
                      <span className="ml-1 text-xs">{workout.kudos}</span>
                    </Button>
                  </Tooltip>
                  <Button variant="outline" color="gray">
                    <MessageSquare className="h-5 w-5" />
                    <span className="ml-1 text-xs">{workout.comments}</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;
