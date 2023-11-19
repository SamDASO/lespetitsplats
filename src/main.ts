//IMPORTS

import { recipes } from "./models/recipes.ts";

//RECIPES CARDS

async function getRecipesData() {
  const recipes = await fetch("./data/recipes.json");
  return recipes.json();
}

//DOM ELEMENTS
const recipesSection = document.getElementById("recipes-section");

function recipesTemplate(recipes: recipes) {
  const { id, image, name, time, description, ingredients } = recipes;

  function getCardDOM() {
    const cardRecipe = document.createElement("div");
    cardRecipe.classList.add("card-recipes");

    const linkRecipe = document.createElement("a");
    linkRecipe.classList.add("link-recipes");
    linkRecipe.setAttribute("href", "/index.html?id=" + `${id}`);

    const imgRecipe = document.createElement("img");
    imgRecipe.classList.add("img-recipes");
    imgRecipe.setAttribute("src", `./assets/recipes/${image}`);

    const titleRecipe = document.createElement("h2");
    titleRecipe.classList.add("title-recipes");
    titleRecipe.textContent = name;

    const recipeSubDiv = document.createElement("div");
    recipeSubDiv.classList.add("recipes-div");

    const recipeSubtitle = document.createElement("h3");
    recipeSubtitle.classList.add("subtitle-recipes");
    recipeSubtitle.textContent = "Recette";

    const recipeDescription = document.createElement("p");
    recipeDescription.classList.add("recipes-desc");
    recipeDescription.textContent = description;

    const timeDuration = document.createElement("span");
    timeDuration.classList.add("time-duration");
    timeDuration.textContent = time.toString() + `mins`;

    const ingredientsSubDiv = document.createElement("div");
    ingredientsSubDiv.classList.add("ingredients-div");

    const ingredientsSubtitle = document.createElement("h3");
    ingredientsSubtitle.classList.add("subtitle-ingredients");
    ingredientsSubtitle.textContent = "Ingrédients";

    function getIngredientsCard() {
      const { ingredient, quantity, unit } = ingredients[0];

      ingredientsSubDiv.appendChild(ingredientsSubtitle);

      ingredients.forEach((element) => {
        const ingredientDiv = document.createElement("div");
        ingredientDiv.classList.add("ingredient-div");

        const ingredientName = document.createElement("p");
        ingredientName.classList.add("ingredient-name");
        ingredientName.textContent = ingredient;

        ingredientDiv.appendChild(ingredientName);

        if (element.quantity && element.quantity !== undefined) {
          const ingredientQuantity = document.createElement("p");
          ingredientQuantity.classList.add("ingredient-quantity");
          ingredientQuantity.textContent = String(quantity);

          ingredientDiv.appendChild(ingredientQuantity);
        }

        if (element.unit && element.unit !== undefined) {
          const ingredientUnit = document.createElement("p");
          ingredientUnit.classList.add("ingredient-unit");
          ingredientUnit.textContent = unit!;

          ingredientDiv.appendChild(ingredientUnit);
        }

        ingredientsSubDiv.appendChild(ingredientDiv);
      });

      return ingredientsSubDiv;
    }

    recipesSection.appendChild(cardRecipe);
    cardRecipe.appendChild(linkRecipe);
    linkRecipe.appendChild(imgRecipe);
    linkRecipe.appendChild(timeDuration);
    linkRecipe.appendChild(titleRecipe);
    linkRecipe.appendChild(recipeSubDiv);

    recipeSubDiv.appendChild(recipeSubtitle);
    recipeSubDiv.appendChild(recipeDescription);

    linkRecipe.appendChild(ingredientsSubDiv);
  }

  return getCardDOM();
}

function displayRecipes(recipes: recipes) {
  const recipesModel = recipesTemplate(recipes);

  recipesSection.appendChild(recipesModel);
}

async function init() {
  const { recipes } = await getRecipesData();

  recipes.forEach(displayRecipes);
}

init();
