<<<<<<< HEAD
export type GoalOption = "lose" | "gain" | "maintain";

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
=======
// src/types/index.ts
export type GoalOption = "lose" | "gain" | "maintain";
export type CategoryOption =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

export interface FoodItem {
  id: string;
>>>>>>> f8c24e672dd18bd865ec8e7981c98bfb3eb48d82
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
