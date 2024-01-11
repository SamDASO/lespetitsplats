import { bench } from "vitest";
import { Recipe } from "./src/models/recipe.ts";
import { RecipesState } from "./src/state/recipesState.ts";
import { FiltersState } from "./src/state/filtersState.ts";

import jsonData from "./data/recipes.json";

const allRecipes: Recipe[] = jsonData.recipes;

const recipesState = new RecipesState([], allRecipes);
const filtersState = new FiltersState(recipesState);

recipesState.addObserver(filtersState);

const searchInput = "tomate";
const filterTag = "couteau";

//With no filters selected
bench(
  "with only the main research",
  () => {
    filtersState.searchFilterText(searchInput);
  },
  { time: 5_000 }
);

bench(
  "with the main research + an ustensil tag",
  () => {
    filtersState.toggleFiltersSelection("ustensils", filterTag);
  },
  { time: 5_000 }
);

bench(
  "without filters",
  () => {
    filtersState.searchFilterText("");
    filtersState.toggleFiltersSelection("ustensils", "");
  },
  { time: 5_000 }
);
