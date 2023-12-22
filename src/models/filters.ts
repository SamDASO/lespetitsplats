export interface Filters {
  ingredients: Set<string>;
  appliances: Set<string>;
  ustensils: Set<string>;
  [key: string]: Set<string>;
}
