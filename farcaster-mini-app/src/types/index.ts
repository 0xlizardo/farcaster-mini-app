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
