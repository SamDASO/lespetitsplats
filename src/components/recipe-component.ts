//IMPORTS

import { Recipe } from "../models/recipe.ts";

//Recipes components

export function getRecipeCardDom(recipe: Recipe) {
  const { id, image, name, time, description } = recipe;

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

  //Ingredients component

  function getIngredientCard(recipe: Recipe) {
    //prendre en paramètre un ingredient, gérer que l'ingrédient donc que le for each ici, dans le for each
    const { ingredients } = recipe;

    const ingredientsSubtitle = document.createElement("h3");
    ingredientsSubtitle.classList.add("subtitle-ingredients");
    ingredientsSubtitle.textContent = "Ingrédients";

    const ingredientBox = document.createElement("div");
    ingredientBox.classList.add("ingredients-box");

    const ingredientsSubDiv = document.createElement("div");
    ingredientsSubDiv.classList.add("ingredients-div");

    ingredients.forEach((element) => {
      const ingredientDiv = document.createElement("div");
      ingredientDiv.classList.add("ingredient-div");

      const ingredientName = document.createElement("p");
      ingredientName.classList.add("ingredient-name");
      ingredientName.textContent = element.ingredient;

      ingredientDiv.appendChild(ingredientName);

      const ingredientQuantityAndUnit = document.createElement("div");
      ingredientQuantityAndUnit.classList.add("ingredient-quantity-unit");

      if (element.quantity && element.quantity !== undefined) {
        //voir pour enlever undefined dans les deux
        const ingredientQuantity = document.createElement("p");
        ingredientQuantity.classList.add("ingredient-quantity");
        ingredientQuantity.textContent = String(element.quantity);

        ingredientQuantityAndUnit.appendChild(ingredientQuantity);
      }

      if (element.unit && element.unit !== undefined) {
        const ingredientUnit = document.createElement("p");
        ingredientUnit.classList.add("ingredient-unit");
        ingredientUnit.textContent = element.unit!;

        ingredientQuantityAndUnit.appendChild(ingredientUnit);
      }

      ingredientDiv.appendChild(ingredientQuantityAndUnit);
      ingredientBox.appendChild(ingredientDiv);
    });

    ingredientsSubDiv.appendChild(ingredientsSubtitle);
    ingredientsSubDiv.appendChild(ingredientBox);
    return ingredientsSubDiv;
  }

  cardRecipe.appendChild(linkRecipe);
  linkRecipe.appendChild(imgRecipe);
  linkRecipe.appendChild(timeDuration);
  linkRecipe.appendChild(titleRecipe);
  linkRecipe.appendChild(recipeSubDiv);

  recipeSubDiv.appendChild(recipeSubtitle);
  recipeSubDiv.appendChild(recipeDescription);

  linkRecipe.appendChild(getIngredientCard(recipe));

  return cardRecipe;
}
