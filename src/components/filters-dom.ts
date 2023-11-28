//imports

import { Recipe } from "../models/recipe.ts";

//Filters

export function getFiltersCardDom(recipes: Recipe[]) {
  const tagsArray: string[] = ["Ingrédients", "Appareils", "Ustensiles"];
  const containers: (HTMLDivElement | Node)[] = [];

  tagsArray.forEach((option) => {
    const containerFilters = document.createElement("div");
    containerFilters.classList.add("filter-container");

    const buttonTags = document.createElement("button");
    buttonTags.classList.add("filters-btn");
    buttonTags.setAttribute("aria-haspopup", "listbox");
    buttonTags.setAttribute("role", "button");
    buttonTags.textContent = option;

    const arrowDown = document.createElement("div");
    arrowDown.classList.add("arrow-down");
    arrowDown.classList.add("arrow-filter");

    containerFilters.appendChild(buttonTags);
    buttonTags.appendChild(arrowDown);

    const menuList = getMenuListDom(
      getUniqueValues(recipes, option.toLowerCase())
    );
    containerFilters.appendChild(menuList);

    containers.push(containerFilters);
  });

  return containers;
}

//MENULIST FUNCTIONS

function getMenuListDom(allData: string[]) {
  const dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-content");

  const formFilter = document.createElement("form");
  formFilter.id = "dropdown-search";

  const inputForm = document.createElement("input");
  inputForm.id = "dropdown-input";
  inputForm.setAttribute("type", "text");
  inputForm.setAttribute("name", "search");
  inputForm.setAttribute("placeholder", "");

  const btnForm = document.createElement("button");
  btnForm.id = "dropdown-btn";
  const imgBtnContent = document.createElement("img");
  imgBtnContent.setAttribute("src", "./assets/icons/search-filter.svg");

  btnForm.appendChild(imgBtnContent);

  const containerData = document.createElement("div");
  containerData.classList.add("container-data");

  allData.forEach((element: string) => {
    const filterElement = document.createElement("p");
    filterElement.classList.add("filtered-element");
    filterElement.textContent = element;

    containerData.appendChild(filterElement);
  });

  /*containerFilters.appendChild(dropdownContent);*/
  dropdownContent.appendChild(formFilter);
  formFilter.appendChild(inputForm);
  formFilter.appendChild(btnForm);
  dropdownContent.appendChild(containerData);

  return dropdownContent;
}

function getUniqueValues(recipes: Recipe[], category: string): string[] {
  const uniqueValuesSet = new Set<string>();

  recipes.forEach((recipe) => {
    const categoryValues = getCategoryValues(recipe, category);
    categoryValues.forEach((value) => uniqueValuesSet.add(value));
  });

  return Array.from(uniqueValuesSet);
}

function getCategoryValues(recipe: Recipe, category: string): string[] {
  // Handle 'ingredients', 'appliance', and 'ustensils' categories
  if (category === "ingrédients") {
    const allIngredients = recipe.ingredients;
    return allIngredients.map((ingredient) => ingredient.ingredient);
  } else if (category === "appareils") {
    return [recipe.appliance];
  } else if (category === "ustensiles") {
    return recipe.ustensils;
  }

  return [];
}
