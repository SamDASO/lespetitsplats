///////////////////////////////////IMPORTS

import { Recipe } from "./models/recipe.ts";
import { RecipeComponent } from "./components/recipeComponent.ts";
import { FiltersComponent } from "./components/filtersComponent.ts";
import { FiltersState } from "./state/filtersState.ts";
import { RecipesState } from "./state/recipesState.ts";

///////////////////////////////////DATAS

export async function getRecipesData() {
  const recipesDatas = await fetch("./data/recipes.json");
  return recipesDatas.json();
}

///////////////////////////////////DISPLAYS FUNCTIONS

export function displayRecipes(state: RecipesState) {
  const recipesSection = document.getElementById("recipes-section");

  state.getRecipesDisplayed().forEach((recipe: Recipe) => {
    const element = new RecipeComponent(recipe);

    recipesSection?.appendChild(element.render());
  });
}

/*function displayFilters(recipes: Recipe[]) {
  const filtersSection = document.getElementById("filters");
  const filtersContainer = document.createElement("div");
  filtersContainer.classList.add("filters-container");

  const filtersDom = getFiltersCardDom(recipes);

  filtersDom.forEach((container) => {
    filtersContainer.appendChild(container);
  });

  const nbrRecipes = document.createElement("p");
  nbrRecipes.classList.add("nbr-recipes");
  nbrRecipes.textContent = "1500 recettes";

  filtersSection?.appendChild(filtersContainer);
  filtersSection?.appendChild(nbrRecipes);
}*/

///////////////////////////////////INIT FUNCTION

async function init() {
  const { recipes } = await getRecipesData();

  //initialisation du state
  const recipesState = new RecipesState(recipes, []);
  const filtersState = new FiltersState();

  // initialisation de l'affichage
  displayRecipes(recipesState);
  /*displayFilters(recipesState.getRecipesDisplayed());*/

  const filtersComponent = new FiltersComponent(filtersState);

  // liaison Observer/Observable
  /*recipesState.addObserver(filtersComponent);*/
}

init();
