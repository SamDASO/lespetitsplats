//IMPORTS

import { recipes } from "./models/recipes.ts";
import { getRecipesCardDom } from "./components/recipes-components.ts";
import { getTagsCardDom } from "./components/tags.ts";

//DATAS

async function getRecipesData() {
  const recipesDatas = await fetch("./data/recipes.json");
  return recipesDatas.json();
}

//DISPLAYS FUNCTIONS

function displayRecipes(recipesArray: recipes[]) {
  const recipesSection = document.getElementById("recipes-section");

  recipesArray.forEach((recipe: recipes) => {
    const recipesModel = getRecipesCardDom(recipe);

    recipesSection?.appendChild(recipesModel);
  });
}

function displayTags() {
  const tagsSection = document.getElementById("tags");
  const tagsContainer = document.createElement("div");
  tagsContainer.classList.add("tags-container");

  const tagsDom = getTagsCardDom();

  tagsDom.forEach((container) => {
    tagsContainer.appendChild(container);
  });

  const nbrRecipes = document.createElement("p");
  nbrRecipes.classList.add("nbr-recipes");
  nbrRecipes.textContent = "1500 recettes";

  tagsSection?.appendChild(tagsContainer);
  tagsSection?.appendChild(nbrRecipes);
}

//INIT FUNCTION

async function init() {
  const { recipes } = await getRecipesData();
  displayRecipes(recipes);

  displayTags();
}

init();
