///////////////////////////////////IMPORTS

import { FiltersContainer } from "./components/filtersContainer.ts";
import { FiltersState } from "./state/filtersState.ts";
import { RecipesState } from "./state/recipesState.ts";
import { Recipe } from "./models/recipe.ts";
import { RecipesContainer } from "./components/recipesContainer.ts";

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
  const recipesContainer = new RecipesContainer(recipesState);

  // Component initialization

  const filtersContainer = new FiltersContainer(filtersState, recipesState);

  //observers
  recipesState.addObserver(filtersContainer);
  recipesState.addObserver(filtersState);
  recipesState.addObserver(recipesContainer);
  filtersState.addObserver(filtersContainer);

  // Display initial content
  recipesState.notifyObservers();
  filtersContainer.render();

  // display initialisation
  recipesState.updateRecipes(
    filtersState.getFilters().selectedFilters,
    filtersState.getFilters().filterText
  );

  //Search Bar
  const searchInput = document.getElementById(
    "search-input-main"
  ) as HTMLInputElement;

  searchInput.addEventListener("input", () => {
    filtersState.searchFilterText(searchInput.value);
  });
}

fetchDataAndInit();
