import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';

const ExerciseSelector = ({ selectedType }) => {

    const { exercises ,  getExercises } = useAuthStore();

    useEffect(() => {
        getExercises();
      }, [getExercises]);

    const [selectedBodyPart, setSelectedBodyPart] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    
    // Cardio measurements
    const [distance, setDistance] = useState('');
    const [time, setTime] = useState('');
    
    // Weight measurements
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');

    // Get unique exercise types
    const exerciseTypes = [...new Set(exercises.map(ex => ex.type))];

    // Get unique body parts for weights type
    const bodyParts = selectedType === 'weights' 
        ? [...new Set(exercises.filter(ex => ex.type === 'weights').map(ex => ex.bodyPart))]
        : [];

    // Get filtered exercises based on type and body part
    const filteredExercises = exercises.filter(ex => 
        ex.type === selectedType && 
        (selectedType === 'cardio' || ex.bodyPart === selectedBodyPart)
    );

    const handleTypeChange = (type) => {
        // Reset all states when type changes
        setSelectedType(type);
        setSelectedBodyPart('');
        setSelectedExercise('');
        setDistance('');
        setTime('');
        setWeight('');
        setReps('');
    };

    const handleBodyPartChange = (bodyPart) => {
        // Reset exercise and measurements when body part changes
        setSelectedBodyPart(bodyPart);
        setSelectedExercise('');
        setWeight('');
        setReps('');
    };

    return (
        <div className="space-y-4 p-4">

            {/* Body Part Selection for Weights */}
            {selectedType === 'weights' && (
                <div>
                    <Label>Body Part</Label>
                    <Select 
                        value={selectedBodyPart} 
                        onValueChange={handleBodyPartChange}
                        disabled={!selectedType}
                    >
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

            {/* Exercise Selection */}
            <div>
                <Label>Exercise</Label>
                <Select 
                    value={selectedExercise} 
                    onValueChange={setSelectedExercise}
                    disabled={selectedType === 'weights' ? !selectedBodyPart : !selectedType}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Exercise" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredExercises.map(exercise => (
                            <SelectItem key={exercise.name} value={exercise.name}>
                                {exercise.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Measurements for Cardio */}
            {selectedType === 'cardio' && selectedExercise && (
                <div className="space-y-2">
                    <div>
                        <Label>Distance (km)</Label>
                        <Input 
                            type="number" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={distance} 
                            onChange={(e) => setDistance(e.target.value)}
                            placeholder="Enter distance" 
                        />
                    </div>
                    <div>
                        <Label>Time (minutes)</Label>
                        <Input 
                            type="number" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={time} 
                            onChange={(e) => setTime(e.target.value)}
                            placeholder="Enter time" 
                        />
                    </div>
                </div>
            )}

            {/* Measurements for Weights */}
            {selectedType === 'weights' && selectedExercise && (
                <div className="space-y-2">
                    <div>
                        <Label>Weight (kg)</Label>
                        <Input 
                            type="number" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={weight} 
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Enter weight" 
                        />
                    </div>
                    <div>
                        <Label>Reps</Label>
                        <Input 
                            type="number" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            value={reps} 
                            onChange={(e) => setReps(e.target.value)}
                            placeholder="Enter reps" 
                        />
                    </div>
                </div>
            )}

            {/* Exercise Details */}
            {selectedExercise && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                    <h3 className="font-bold mb-2">Selected Exercise Details:</h3>
                    <p>
                        {exercises.find(ex => ex.name === selectedExercise)?.description}
                    </p>
                    {selectedType === 'cardio' && (
                        <div className="mt-2">
                            <p>Distance: {distance} km</p>
                            <p>Time: {time} minutes</p>
                        </div>
                    )}
                    {selectedType === 'weights' && (
                        <div className="mt-2">
                            <p>Weight: {weight} kg</p>
                            <p>Reps: {reps}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExerciseSelector;