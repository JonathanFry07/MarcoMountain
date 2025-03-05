import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';

const ExerciseSelector = ({ selectedType, onAddExercise }) => {
    const { exercises, getExercises } = useAuthStore();

    useEffect(() => {
        getExercises();  // Fetch exercises when the component mounts
    }, [getExercises]);

    const [selectedBodyPart, setSelectedBodyPart] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [distance, setDistance] = useState(''); // Start as an empty string
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');

    // Filter out unique types and body parts based on selected workout type (cardio or weights)
    const bodyParts = selectedType === 'weights' 
        ? [...new Set(exercises.filter(ex => ex.type === 'weights').map(ex => ex.bodyPart))] 
        : [];

    // Filter exercises based on selected type and body part (for weights)
    const filteredExercises = exercises.filter(ex => 
        ex.type === selectedType && 
        (selectedType === 'cardio' || ex.bodyPart === selectedBodyPart)
    );

    const handleBodyPartChange = (bodyPart) => {
        setSelectedBodyPart(bodyPart);
        setSelectedExercise(''); // Reset exercise selection
        setSets('');
        setReps('');
    };

    const handleAddExercise = () => {
        if (selectedExercise) {
            const exercise = exercises.find(ex => ex.name === selectedExercise);
            
            const exerciseData = {
                id: exercise.id,
                name: selectedExercise,
                ...(selectedType === 'cardio' 
                    ? { distance: Number.parseFloat(distance) || 0 }  // Parse distance as a number
                    : { sets: Number(sets), reps: Number(reps) }
                )
            };

            console.log('Exercise Data:', exerciseData); // Debug log to verify values
            onAddExercise(exerciseData);
        }
    };

    return (
        <div className="space-y-4 p-4">
            {selectedType === 'weights' && (
                <div>
                    <Label>Body Part</Label>
                    <Select value={selectedBodyPart} onValueChange={handleBodyPartChange}>
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

            {selectedType === 'cardio' && selectedExercise && (
                <div>
                    <Label>Distance (km)</Label>
                    <Input 
                        type="number" 
                        value={distance} 
                        onChange={(e) => setDistance(e.target.value)} 
                        placeholder="Enter distance" 
                    />
                </div>
            )}

            {selectedType === 'weights' && selectedExercise && (
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <Label>Sets</Label>
                        <Input 
                            type="number" 
                            value={sets} 
                            onChange={(e) => setSets(e.target.value)} 
                            placeholder="Enter sets" 
                        />
                    </div>
                    <div className="w-1/2">
                        <Label>Reps</Label>
                        <Input 
                            type="number" 
                            value={reps} 
                            onChange={(e) => setReps(e.target.value)} 
                            placeholder="Enter reps" 
                        />
                    </div>
                </div>
            )}

            <button 
                onClick={handleAddExercise} 
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
                disabled={!selectedExercise}
            >
                Add to Workout
            </button>
        </div>
    );
};

export default ExerciseSelector;
