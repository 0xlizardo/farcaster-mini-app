export type GoalOption = "lose" | "gain" | "maintain";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type CategoryOption =
  | "solid"
  | "liquid"
  | "snack"
  | "fruit"
  | "breakfast"
  | "lunch"
  | "dinner";

export interface FoodItem {
  id: number;
  name: string;
  calories: number;
  amount: number;
  unit: string;
  category: CategoryOption;
  mealType: MealType;
  image?: string;
}

export interface ActivityItem {
  id: number;
  name: string;
  duration: number;
  caloriesBurned: number;
}

export interface MealCalorieDistribution {
  breakfast: number;
  lunch: number;
  dinner: number;
  snack: number;
  total: number;
}

export interface MealProgress {
  mealType: MealType;
  target: number;
  consumed: number;
  remaining: number;
}
