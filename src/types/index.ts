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

export type GoalOption = "lose" | "gain" | "maintain";
