import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';

const ExerciseSelector = ({ selectedType, onAddExercise }) => {
  const { user, exercises, getExercises, getCustomExercises, createCustomExercise } = useAuthStore();

  useEffect(() => {
    if (exercises.length === 0) {
      getExercises();
      if (user?.email) {
        getCustomExercises(user.email);
      }
    }
  }, [getExercises, getCustomExercises, user]);

  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [distance, setDistance] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDescription, setNewExerciseDescription] = useState('');
  const [newExerciseBodyPart, setNewExerciseBodyPart] = useState('');
  const [creationError, setCreationError] = useState('');

  const bodyParts = selectedType === 'weights'
    ? [...new Set(exercises.filter(ex => ex.type === 'weights').map(ex => ex.bodyPart))]
    : [];

  const filteredExercises = exercises.filter(ex =>
    ex.type === selectedType &&
    (selectedType === 'cardio' || ex.bodyPart === selectedBodyPart)
  );

  const handleCreateExercise = async () => {
    if (!newExerciseName) {
      setCreationError("Name is required");
      return;
    }
    if (selectedType === 'weights' && !newExerciseBodyPart) {
      setCreationError("Body part is required for weights exercises");
      return;
    }

    const created = await createCustomExercise(
      user.email,
      newExerciseName,
      selectedType,
      newExerciseDescription,
      newExerciseBodyPart
    );

    if (created) {
      setNewExerciseName('');
      setNewExerciseDescription('');
      setNewExerciseBodyPart('');
      setCreationError('');
      setIsCreatingNew(false);
      getCustomExercises(user.email);
    } else {
      setCreationError("Failed to create exercise");
    }
  };

  const handleAddExerciseClick = () => {
    if (selectedType === 'weights') {
      onAddExercise({
        name: selectedExercise,
        sets: sets,
        reps: reps,
      });
    } else {
      onAddExercise({
        name: selectedExercise,
        distance: distance,
        time: distance ? '15' : '', // Just an example of default time for cardio
      });
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-3xl">
      {isCreatingNew ? (
        <div className="space-y-4">
          <Label>New Exercise Name</Label>
          <Input
            type="text"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            placeholder="Enter exercise name"
            required
          />
          <Label>Description</Label>
          <Input
            type="text"
            value={newExerciseDescription}
            onChange={(e) => setNewExerciseDescription(e.target.value)}
            placeholder="Enter description (optional)"
            required
          />
          {selectedType === 'weights' && (
            <>
              <Label>Body Part</Label>
              <Select value={newExerciseBodyPart} onValueChange={setNewExerciseBodyPart}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Body Part" />
                </SelectTrigger>
                <SelectContent>
                  {bodyParts.map((bodyPart) => (
                    <SelectItem key={bodyPart} value={bodyPart}>
                      {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
          {creationError && <p className="text-red-500 text-sm">{creationError}</p>}
          <div className="flex space-x-4">
            <button
              onClick={handleCreateExercise}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex-1"
            >
              Save Exercise
            </button>
            <button
              onClick={() => setIsCreatingNew(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {selectedType === 'weights' && (
            <div>
              <Label>Body Part</Label>
              <Select value={selectedBodyPart} onValueChange={setSelectedBodyPart}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Body Part" />
                </SelectTrigger>
                <SelectContent>
                  {bodyParts.map(bodyPart => (
                    <SelectItem key={bodyPart} value={bodyPart}>
                      {bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Exercise</Label>
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger>
                <SelectValue placeholder="Select Exercise" />
              </SelectTrigger>
              <SelectContent>
                {filteredExercises.map(exercise => (
                  <SelectItem key={exercise.id} value={exercise.name}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedType === 'weights' && (
            <div className="mt-4 flex space-x-4">
              <div className="flex-1">
                <Label>Sets</Label>
                <Input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="Sets"
                  min="1"
                />
              </div>
              <div className="flex-1">
                <Label>Reps</Label>
                <Input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="Reps"
                  min="1"
                />
              </div>
            </div>
          )}

          {selectedType === 'cardio' && (
            <div className="mt-4">
              <Label>Distance (in km)</Label>
              <Input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Enter distance"
                min="0"
              />
            </div>
          )}

          <button
            onClick={handleAddExerciseClick}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 w-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Add Exercise
          </button>

          <button
            className="mt-2 px-4 py-2 bg-cyan-400 text-white rounded-xl hover:bg-cyan-500 w-full transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={() => setIsCreatingNew(true)} // Toggle to create new exercise
          >
            Create New Exercise
          </button>
        </>
      )}
    </div>
  );
};

export default ExerciseSelector;
