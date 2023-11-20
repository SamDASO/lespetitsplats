export interface recipes {
  id: number;
  image: string;
  name: string;
  servings: number;
  ingredients: ingredientsArray[];
  time: number;
  description: string;
  appliance: string;
  ustensils: string[];
}
