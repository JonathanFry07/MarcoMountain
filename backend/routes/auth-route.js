import express from "express";
import { signup, login, logout, checkAuth, addWorkout, addExercise } from "../controllers/auth-controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getExercises, getWorkouts } from "../controllers/auth-getters.js";

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/post-workout', addWorkout);

router.post('/post-exercise', addExercise);

router.get('/check-auth', verifyToken, checkAuth);

router.get('/get-workouts', getWorkouts);

router.get('/get-exercises', getExercises);

export default router;