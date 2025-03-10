import express from "express";
import { signup, login, logout, checkAuth, addWorkout, addExercise, finishWorkout, createWorkoutHistory, addRestDay } from "../controllers/auth-controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getExercises, getWorkoutHistory, getWorkouts, getWorkoutsById } from "../controllers/auth-getters.js";

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/post-workout/:email', addWorkout);

router.post('/post-exercise', addExercise);

router.post('/finish-workout', finishWorkout);

router.post('/create-workout-history', createWorkoutHistory);

router.post('/post-rest-day', addRestDay);

router.get('/check-auth', verifyToken, checkAuth);

router.get('/get-workouts/:email', getWorkouts);

router.get('/get-workout-id/:id', getWorkoutsById);

router.get('/get-exercises', getExercises);

router.get('/get-workout-history/:email', getWorkoutHistory);

export default router;