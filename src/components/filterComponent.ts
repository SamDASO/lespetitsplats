import { Component } from "../models/component.ts";
import { FilterState } from "../state/filterState.ts";
import { FiltersState } from "../state/filtersState.ts";

export class FilterComponent implements Component {
  private state: FilterState;

  constructor(state: FilterState) {
    this.state = state;
  }

  render(): HTMLElement {
    const tagsArray: string[] = ["Ingrédients", "Appareils", "Ustensiles"];
    const filtersStateInstance = new FiltersState();
    let filtersDisplay: Set<string>;

    tagsArray.forEach((option) => {
      if (option === "Ingrédients") {
        filtersDisplay = filtersStateInstance.getFiltersToDisplay().ingredients;
      }
      if (option === "Appareils") {
        filtersDisplay = filtersStateInstance.getFiltersToDisplay().appliances;
      }
      if (option === "Ustensiles") {
        filtersDisplay = filtersStateInstance.getFiltersToDisplay().ustensils;
      }
    });

    return this.getMenuListDom(filtersDisplay!);
  }

  private getMenuListDom(filters: any): HTMLElement {
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

    filters.forEach((filter: any) => {
      const filterElement = document.createElement("p");
      filterElement.classList.add("filtered-element");
      filterElement.textContent = filter;

      containerData.appendChild(filterElement);
    });

    dropdownContent.appendChild(formFilter);
    formFilter.appendChild(inputForm);
    formFilter.appendChild(btnForm);
    dropdownContent.appendChild(containerData);

    return dropdownContent;
  }
}
