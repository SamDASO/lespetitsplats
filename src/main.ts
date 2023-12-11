///////////////////////////////////IMPORTS

import { RecipeComponent } from "./components/recipeComponent.ts";
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

function init(recipesdata: Recipe[]) {
  const recipes = recipesdata;

  //state initialisation
  const recipesState = new RecipesState([], recipes);
  const filtersState = new FiltersState(recipesState);

  // Component initialization
  const recipesComponents: RecipeComponent[] = recipesState
    .getRecipesDisplayed()
    .map((recipe) => new RecipeComponent(recipe));

  const filtersComponent = new FiltersComponent(filtersState);

  //observers
  recipesState.addObserver(filtersState);
  filtersState.addObserver(recipesState);

  // Display initial content
  recipesComponents.forEach((component) => {
    component.render();
  });
  recipesState.notifyObservers();
  filtersComponent.render();

  // display initialisation
  const containerElement = document.getElementById("recipes-section");

  recipesComponents.forEach((component) => {
    containerElement?.appendChild(component.render());
  });
}

fetchDataAndInit();
