///////////////////////////////////IMPORTS

import { Recipe } from "./models/recipe.ts";
import { getRecipeCardDom } from "./components/recipe-component.ts";
import { getFiltersCardDom } from "./components/filters-dom.ts";

///////////////////////////////////DATAS

export async function getRecipesData() {
  const recipesDatas = await fetch("./data/recipes.json");
  return recipesDatas.json();
}

///////////////////////////////////DISPLAYS FUNCTIONS

function displayRecipes(recipesArray: Recipe[]) {
  const recipesSection = document.getElementById("recipes-section");

  recipesArray.forEach((recipe: Recipe) => {
    const recipesModel = getRecipeCardDom(recipe);

    recipesSection?.appendChild(recipesModel);
  });
}

function displayFilters(recipes: Recipe[]) {
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
}

///////////////////////////////////INIT FUNCTION

async function init() {
  const { recipes } = await getRecipesData();
  displayRecipes(recipes);

  displayFilters(recipes);

  ///////////////////////////////////EVENTLISTENER

  //FILTERS BUTTONS
  const filtersBtn = document.querySelectorAll(".filters-btn");

  filtersBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const button = btn as HTMLElement;
      const dropdownMenu = button.nextElementSibling as HTMLElement;
      const arrow = button.querySelector(".arrow-filter") as HTMLElement;

      if (dropdownMenu.style.display === "none") {
        dropdownMenu.style.display = "flex";
        button.style.borderBottomRightRadius = "0";
        button.style.borderBottomLeftRadius = "0";
        arrow.classList.add("arrow-up");
        arrow.classList.remove("arrow-down");
      } else {
        dropdownMenu.style.display = "none";
        button.style.borderBottomRightRadius = "11px";
        button.style.borderBottomLeftRadius = "11px";
        arrow.classList.add("arrow-down");
        arrow.classList.remove("arrow-up");
      }
    });
  });
}

init();
