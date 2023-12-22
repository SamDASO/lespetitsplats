///////////////////////////////////IMPORTS

import { FiltersComponent } from "./components/filtersComponent.ts";
import { FiltersState } from "./state/filtersState.ts";
import { RecipesState } from "./state/recipesState.ts";
import { Recipe } from "./models/recipe.ts";

///////////////////////////////////DATAS

export async function getRecipesData() {
  const recipesDatas = await fetch("./data/recipes.json");
  return recipesDatas.json();
}

async function fetchDataAndInit() {
  const { recipes } = await getRecipesData();
  init(recipes);
}

///////////////////////////////////INIT FUNCTION

function init(recipesData: Recipe[]) {
  const recipes = recipesData;

  //state initialisation
  const recipesState = new RecipesState([], recipes);
  const filtersState = new FiltersState(recipesState);

  // Component initialization

  const filtersComponent = new FiltersComponent(filtersState, recipesState);

  //observers
  recipesState.addObserver(filtersComponent);
  recipesState.addObserver(filtersState);
  filtersState.addObserver(filtersComponent);

  // Display initial content
  recipesState.notifyObservers();
  filtersComponent.render();

  // display initialisation
  recipesState.updateRecipes(filtersState.getFilters().selectedFilters);
}

fetchDataAndInit();
