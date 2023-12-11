import { Component } from "../models/component.ts";
import { IObserver } from "../models/observer-interfaces.ts";
import { Filters } from "../models/filters.ts";
import { FiltersState } from "../state/filtersState.ts";

export class FilterComponent implements Component, IObserver {
  private option: string;
  private state: FiltersState;
  private allFilters: {
    availableFilters: Filters;
    selectedFilters: Filters;
  };

  constructor(state: FiltersState, option: string) {
    this.option = option;
    this.state = state;
    this.allFilters = {
      availableFilters: {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set(),
      },
      selectedFilters: {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set(),
      },
    };
  }

  //Render one button, with all it's content and the dropdownMenu depending of the option
  //Observes filtersState and take all the filters to display in the list
  // manage the addeventlistener that needs to be looked by it's state

  render(): HTMLElement {
    //////////////////button

    const btnOption = document.createElement("button");
    btnOption.classList.add("filters-btn");
    btnOption.id = `filters-btn-${this.option}`;
    btnOption.setAttribute("aria-haspopup", "listbox");
    btnOption.setAttribute("role", "button");
    btnOption.textContent = this.option;

    const arrowElement = document.createElement("div");
    arrowElement.classList.add("arrow-down");
    arrowElement.classList.add("arrow-filter");

    btnOption.appendChild(arrowElement);

    //////////////////Filters menu list

    let filterListContainer = document.createElement("div");
    filterListContainer.classList.add("dropdown-container");

    //Search bar for option

    const formFilter = document.createElement("form");
    formFilter.classList.add("dropdown-search");
    formFilter.id = `dropdown-search-${this.option}`;

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
    formFilter.appendChild(inputForm);
    formFilter.appendChild(btnForm);

    filterListContainer.appendChild(formFilter);

    //DropdownList

    let filtersDisplay = this.sortFiltersByOptions(this.option);
    const dropdownList = this.getMenuListDom(filtersDisplay as Filters);

    filterListContainer.appendChild(dropdownList);

    /////AdEventListener
    //button

    btnOption.addEventListener("click", () => {
      if (filterListContainer.style.display === "none") {
        filterListContainer.style.display = "flex";
        btnOption.style.borderBottomRightRadius = "0";
        btnOption.style.borderBottomLeftRadius = "0";
        arrowElement.classList.add("arrow-up");
        arrowElement.classList.remove("arrow-down");
      } else {
        filterListContainer.style.display = "none";
        btnOption.style.borderBottomRightRadius = "11px";
        btnOption.style.borderBottomLeftRadius = "11px";
        arrowElement.classList.add("arrow-down");
        arrowElement.classList.remove("arrow-up");
      }
    });

    //Toggle selected filters

    /*const newSelectedFilter = this.allFilters.addFilter();
    const newUnselectedFilter = this.allFilters.removeFilter();*/

    return filterListContainer;
  }

  private getMenuListDom(filters: Filters): HTMLDivElement {
    const dropdownContent = document.createElement("div");
    dropdownContent.classList.add("dropdown-content");
    dropdownContent.id = `dropdown-content-${this.option}`;

    Object.entries(filters).forEach((filterSet: Set<string>) => {
      filterSet.forEach((filter: string) => {
        const filterElement = document.createElement("p");
        filterElement.classList.add("filtered-element");
        filterElement.textContent = filter;

        // Add click event listener for adding/removing filters
        filterElement.addEventListener("click", () => {
          if (this.allFilters.selectedFilters[this.option].has(filter)) {
            this.removeFilter(filter, this.option);
          } else {
            this.addFilter(filter, this.option);
          }
        });

        dropdownContent.appendChild(filterElement);
      });
    });

    return dropdownContent;
  }

  update(filters: Filters) {
    this.allFilters.availableFilters = filters;
  }

  private sortFiltersByOptions(option: string) {
    if (option.toLowerCase() === "ingrédients") {
      return this.allFilters.availableFilters.ingredients;
    }
    if (option.toLowerCase() === "appareils") {
      return this.allFilters.availableFilters.appliances;
    }
    if (option.toLowerCase() === "ustensiles") {
      return this.allFilters.availableFilters.ustensils;
    }
    return this.allFilters.availableFilters;
  }

  private addFilter(filter: string, option: string) {
    const selectedFilters = this.allFilters.selectedFilters[
      option
    ] as Set<string>;
    selectedFilters.add(filter);
    this.state.notifyObservers();
  }

  private removeFilter(filter: string, option: string) {
    const selectedFilters = this.allFilters.selectedFilters[
      option
    ] as Set<string>;
    selectedFilters.delete(filter);
    this.state.notifyObservers();
  }
}
