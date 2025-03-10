import { create } from "zustand";

const API_URL = "http://localhost:3000/api/auth";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  workouts: [],
  exercises: [],
  workoutHistory: [],

  signup: async (email, name, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, name, password }),
      });
      const data = await response.json();
      set({ isLoading: false, isAuthenticated: true, user: data.user });
      return data;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      set({ isLoading: false, isAuthenticated: true, user: data.user });
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false, error: error.message });
      console.log("Login failed", error);
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await fetch(`${API_URL}/check-auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();

      if (data.user) {
        set({ isAuthenticated: true, user: data.user, isCheckingAuth: false });
      } else {
        set({ isAuthenticated: false, user: null, isCheckingAuth: false });
      }
    } catch (error) {
      set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      console.log(error);
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      set({ isLoading: false, isAuthenticated: false, user: null });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  getWorkouts: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/get-workouts/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({ isLoading: false, workouts: data.workouts });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  getWorkoutById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/get-workout-id/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({ isLoading: false, workouts: data });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  getExercises: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/get-exercises`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({ isLoading: false, exercises: data.exercises });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  createWorkout: async (title, type, exercises, email) => {
    // Set loading state at the beginning of the request
    set({ isLoading: true, error: null });

    // Validate input fields
    if (!title || !type || !exercises || !Array.isArray(exercises)) {
      set({
        isLoading: false,
        error: "All fields are required: title, type, exercises",
      });
      console.error("Error: Missing required fields (title, type, exercises).");
      return null;
    }

    // Validate each exercise
    try {
      const validatedExercises = exercises.map((exercise) => {
        // For weights, ensure sets and reps are numbers
        if (type === "weights") {
          const sets = Number(exercise.sets);
          const reps = Number(exercise.reps);

          if (!exercise.exerciseId || isNaN(sets) || isNaN(reps)) {
            throw new Error("Invalid exercise data for weights");
          }

          return {
            ...exercise,
            sets,
            reps,
          };
        }
        // For cardio, ensure exerciseId and distance are valid
        else if (type === "cardio") {
          const distance = Number(exercise.distance);

          if (!exercise.exerciseId || isNaN(distance)) {
            throw new Error("Invalid exercise data for cardio");
          }

          return {
            ...exercise,
            distance,
          };
        }

        throw new Error("Invalid workout type");
      });

      // Rest of your existing code remains the same
      const response = await fetch(`${API_URL}/post-workout/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          type,
          exercises: validatedExercises,
        }),
      });

      // ... rest of your existing code
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Error creating workout:", error);
      return null;
    }
  },
  createExercise: async (name, type, description, bodyPart) => {
    set({ isLoading: true, error: null });

    if (!name || !type || (type === "weights" && !bodyPart)) {
      set({
        isLoading: false,
        error:
          "Required fields missing: name, type, and for weights, a non-empty bodyPart",
      });
      return null;
    }

    if (type !== "cardio" && type !== "weights") {
      set({
        isLoading: false,
        error: "Invalid type. Must be either 'cardio' or 'weights'",
      });
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/post-exercise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          type,
          description: description || "",
          bodyPart: type === "weights" ? bodyPart : "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        set({ isLoading: false, message: "Exercise Created Successfully" });
        return data;
      }

      set({
        isLoading: false,
        error: data.message || "Failed to create exercise",
      });
      return null;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      return null;
    }
  },
  finishWorkout: async (email, type, results) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/finish-workout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, type, results }),
      });
      if (response.ok) {
        set({ isLoading: false, message: "Completed Workout" });
      }
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      return null;
    }
  },
  getWorkoutHistory: async (email) => {
    set({ isLoading: true, error: null, workoutHistory: [] });
    try {
      const response = await fetch(`${API_URL}/get-workout-history/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({ isLoading: false, workoutHistory: data.data });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
}));
