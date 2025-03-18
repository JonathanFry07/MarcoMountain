import express from "express";
import { signup, login, logout, checkAuth, addWorkout, addExercise, finishWorkout, createWorkoutHistory, addRestDay, setWorkoutTarget, addCustomExercise, upsertUserMacros, setHeightAndWeight, addMeal, addPost, addKudos } from "../controllers/auth-controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getCustomExercises, getExerciseHistory, getExercises, getWorkoutHistory, getWorkouts, getWorkoutsById, getHistoryByEmailUser, getMarcos, getUser, getDailyMacrosAggregate, getNutrition, getMealsForPage, getPosts } from "../controllers/auth-getters.js";

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/post-workout/:email', addWorkout);

router.post('/post-exercise', addExercise);

router.post('/post-custom-exercise', addCustomExercise);

router.post('/finish-workout', finishWorkout);

router.post('/post-workout-history', createWorkoutHistory);

router.post('/post-rest-day', addRestDay);

router.post('/post-workout-target', setWorkoutTarget);

router.post('/upsert-marcos', upsertUserMacros);

router.post('/update-user', setHeightAndWeight);

router.post('/post-meal', addMeal);

router.post('/post-post', addPost);

router.post('/:postId/kudos', addKudos);

router.get('/check-auth', verifyToken, checkAuth);

router.get('/get-workouts/:email', getWorkouts);

router.get('/get-workout-id/:id', getWorkoutsById);

router.get('/get-exercises', getExercises);

router.get('/get-custom-exercises/:email', getCustomExercises);

router.get('/get-workout-history/:email', getWorkoutHistory);

router.get('/get-exercise-history/:email', getExerciseHistory);

router.get('/get-exercise-user-history/', getHistoryByEmailUser);

router.get('/get-marcos/:email', getMarcos);

router.get('/get-user/:email', getUser);

router.get('/get-macros/', getDailyMacrosAggregate)

router.get('/get-nutrition', getNutrition);

router.get('/get-meals', getMealsForPage);

router.get('/get-posts', getPosts);

export default router;