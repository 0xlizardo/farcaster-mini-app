// src/types/index.ts

export type CategoryOption = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodItem {
  id: number;
  name: string;
  calories: number;
  amount: number;
  unit: string;
  category: CategoryOption;
}

export interface ActivityItem {
  id: number;
  name: string;
  duration: number;       // in minutes
  caloriesBurned: number;
}

export type GoalOption = "lose" | "gain" | "maintain";
