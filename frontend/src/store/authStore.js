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
  getWorkouts: async() => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/get-workouts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({isLoading: false, workouts: data.workouts });

    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  getExercises: async() => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/get-exercises`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      set({isLoading: false, exercises: data.exercises });

    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  createWorkout: async (title, type, exercises) => {
    set({ isLoading: true, error: null });
    
    if (!title || !type || !exercises || !Array.isArray(exercises)) {
        set({ isLoading: false, error: "All fields are required: title, type, exercises" });
        return null;
    }

    try {
        for (const exercise of exercises) {
            if (!exercise.exerciseId || typeof exercise.sets !== 'number' || typeof exercise.reps !== 'number') {
                set({ isLoading: false, error: "Invalid exercise data" });
                return null;
            }
        }

        const response = await fetch(`${API_URL}/create-workout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, type, exercises })
        });

        const data = await response.json();

        if (response.ok) {
            set({ isLoading: false, message: "Workout Created Successfully" });
            return data;
        }

        set({ isLoading: false, error: data.message || "Failed to create workout" });
        return null;
    } catch (error) {
        set({ isLoading: false, error: error.message });
        console.log(error);
        return null;
    }
},
createExercise: async (name, type, description, bodyPart) => {
  set({ isLoading: true, error: null });

  if (!name || !type || (type === 'weights' && !bodyPart)) {
      set({ isLoading: false, error: "Required fields missing: name, type, and for weights, a non-empty bodyPart" });
      return null;
  }

  if (type !== 'cardio' && type !== 'weights') {
      set({ isLoading: false, error: "Invalid type. Must be either 'cardio' or 'weights'" });
      return null;
  }

  try {
      const response = await fetch(`${API_URL}/create-exercise`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, type, description: description || "", bodyPart: type === 'weights' ? bodyPart : "" })
      });

      const data = await response.json();

      if (response.ok) {
          set({ isLoading: false, message: "Exercise Created Successfully" });
          return data;
      }

      set({ isLoading: false, error: data.message || "Failed to create exercise" });
      return null;
  } catch (error) {
      set({ isLoading: false, error: error.message });
      console.log(error);
      return null;
  }
}
}));
