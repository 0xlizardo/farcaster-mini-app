// src/types/index.ts
export type GoalOption = "lose" | "gain" | "maintain";
export type CategoryOption =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  amount: number;
  unit: string;
  category: CategoryOption;
  image?: string;
}

export interface ActivityItem {
  id: number;
  name: string;
  duration: number;
  caloriesBurned: number;
}
