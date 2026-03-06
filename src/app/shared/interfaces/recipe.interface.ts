export interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  carbs?: number;
  protein?: number;
  fat?: number;
  calories?: number;
}
