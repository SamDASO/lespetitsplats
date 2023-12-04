///////////////////////////////////IMPORTS

import { RecipeComponent } from "./components/recipeComponent.ts";
import { FiltersComponent } from "./components/filtersComponent.ts";
import { FiltersState } from "./state/filtersState.ts";
import { RecipesState } from "./state/recipesState.ts";
import { FilterState } from "./state/filterState.ts";
import { FilterComponent } from "./components/filterComponent.ts";

///////////////////////////////////DATAS

export async function getRecipesData() {
  const recipesDatas = await fetch("./data/recipes.json");
  return recipesDatas.json();
}

///////////////////////////////////INIT FUNCTION

async function init() {
  const { recipes } = await getRecipesData();

  //state initialisation
  const filtersState = new FiltersState();
  const recipesState = new RecipesState([], recipes);
  const filterState = new FilterState([]);

  // Component initialization
  const recipesComponents: RecipeComponent[] = recipesState
    .getRecipesDisplayed()
    .map((recipe) => new RecipeComponent(recipe));
  const filtersComponent = new FiltersComponent(filtersState);
  const filterComponent = new FilterComponent();

  // Display initial content
  recipesComponents.forEach((component) => {
    component.render();
  });
  filtersComponent.render();
  filterComponent.render();

  // display initialisation
  const containerElement = document.getElementById("recipes-section");

  recipesComponents.forEach((component) => {
    containerElement?.appendChild(component.render());
  });

  // Recipes components observes the recipes state
  recipesComponents.forEach((component) => {
    recipesState.addObserver(component);
  });

  // Filters component observe the filters state
  filtersState.addObserver(filtersComponent, false);

  //FilterElement component observes the filter state
  filterState.addObserver(filterComponent);
}

init();
