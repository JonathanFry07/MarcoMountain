import mongoose from "mongoose";

const ingredientDetailSchema = new mongoose.Schema(
  {
    ingredientName: { type: String, required: true },
    amountInGrams: { type: Number, required: true },
  },
  { timestamps: true }
);

const preparationStepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const mealSchema = new mongoose.Schema(
  {
    mealId: { type: Number, unique: true },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    name: { type: String, required: true },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    foods: [
      {
        name: { type: String, required: true },
        servingSize: { type: Number, required: true },
        calories: { type: Number, required: true },
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fat: { type: Number, required: true },
      },
    ],
    totalMacros: {
      calories: { type: Number, required: true },
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fat: { type: Number, required: true },
    },
    ingredients: [ingredientDetailSchema],
    preparationSteps: [preparationStepSchema],
    prepTime: { type: Number, required: false }, // Total prep time in minutes
  },
  { timestamps: true }
);

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;
