import express from "express";
import { signup, login, logout, checkAuth, addWorkout, addExercise } from "../controllers/auth-controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getExercises, getWorkouts, getWorkoutsById } from "../controllers/auth-getters.js";

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/post-workout/:email', addWorkout);

router.post('/post-exercise', addExercise);

router.get('/check-auth', verifyToken, checkAuth);

router.get('/get-workouts/:email', getWorkouts);

router.get('/get-workout-id/:id', getWorkoutsById);

router.get('/get-exercises', getExercises);

export default router;