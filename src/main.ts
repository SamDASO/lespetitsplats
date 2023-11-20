//IMPORTS

import { recipes } from "./models/recipes.ts";
import { getRecipesCardDom } from "./components/recipes-components.ts";

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

    recipesSection.appendChild(recipesModel);
  });
}

//INIT FUNCTION

async function init() {
  const { recipes } = await getRecipesData();
  displayRecipes(recipes);
}

init();
