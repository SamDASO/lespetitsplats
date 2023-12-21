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

function init(recipesData: Recipe[]) {
  const recipes = recipesData;

  //state initialisation
  const recipesState = new RecipesState([], recipes);
  const filtersState = new FiltersState(recipesState);
  console.log(
    "recipesState on main initialised :",
    recipesState,
    "and recipes argument",
    recipes
  );
  console.log("filterState on main initialised :", filtersState);
  // Component initialization
  const recipesComponents: RecipeComponent[] = recipesState
    .getRecipesDisplayed()
    .map((recipe) => new RecipeComponent(recipe));

  const filtersComponent = new FiltersComponent(filtersState, recipesState);
  console.log("filterscomponent on main initialised :", filtersComponent);

  //observers
  recipesState.addObserver(filtersComponent);
  recipesState.addObserver(filtersState);
  filtersState.addObserver(filtersComponent);

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
