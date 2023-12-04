//IMPORTS

import { Recipe } from "../models/recipe.ts";
import { Component } from "../models/component.ts";
import { Ingredient } from "../models/ingredient.ts";
import { IObserver } from "../models/observer-interfaces.ts";

//class recipes DOM

export class RecipeComponent implements Component, IObserver {
  private recipe: Recipe;

  constructor(recipe: Recipe) {
    this.recipe = recipe;
  }

  render(): HTMLElement {
    const { id, image, name, time, description } = this.recipe;

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

    cardRecipe.appendChild(linkRecipe);
    linkRecipe.appendChild(imgRecipe);
    linkRecipe.appendChild(timeDuration);
    linkRecipe.appendChild(titleRecipe);
    linkRecipe.appendChild(recipeSubDiv);

    recipeSubDiv.appendChild(recipeSubtitle);
    recipeSubDiv.appendChild(recipeDescription);

    linkRecipe.appendChild(this.getIngredientDiv());

    return cardRecipe;
  }

  update(recipesUpdates: Recipe[]) {
    recipesUpdates.forEach((recipeUpdate) => {
      this.recipe = recipeUpdate;
    });
  }
  //Ingredients component

  private getIngredientDiv() {
    const { ingredients } = this.recipe;

    const ingredientsSubtitle = document.createElement("h3");
    ingredientsSubtitle.classList.add("subtitle-ingredients");
    ingredientsSubtitle.textContent = "Ingrédients";

    const ingredientBox = document.createElement("div");
    ingredientBox.classList.add("ingredients-box");

    const ingredientsSubDiv = document.createElement("div");
    ingredientsSubDiv.classList.add("ingredients-div");

    ingredients.forEach((element) => {
      ingredientBox.appendChild(this.getIngredientCard(element));
    });

    ingredientsSubDiv.appendChild(ingredientsSubtitle);
    ingredientsSubDiv.appendChild(ingredientBox);
    return ingredientsSubDiv;
  }
  private getIngredientCard(ingredient: Ingredient) {
    const ingredientDiv = document.createElement("div");
    ingredientDiv.classList.add("ingredient-div");

    const ingredientName = document.createElement("p");
    ingredientName.classList.add("ingredient-name");
    ingredientName.textContent = ingredient.ingredient;

    ingredientDiv.appendChild(ingredientName);

    const ingredientQuantityAndUnit = document.createElement("div");
    ingredientQuantityAndUnit.classList.add("ingredient-quantity-unit");

    if (ingredient.quantity) {
      const ingredientQuantity = document.createElement("p");
      ingredientQuantity.classList.add("ingredient-quantity");
      ingredientQuantity.textContent = String(ingredient.quantity);

      ingredientQuantityAndUnit.appendChild(ingredientQuantity);
    }

    if (ingredient.unit) {
      const ingredientUnit = document.createElement("p");
      ingredientUnit.classList.add("ingredient-unit");
      ingredientUnit.textContent = ingredient.unit!;

      ingredientQuantityAndUnit.appendChild(ingredientUnit);
    }

    ingredientDiv.appendChild(ingredientQuantityAndUnit);

    return ingredientDiv;
  }
}
