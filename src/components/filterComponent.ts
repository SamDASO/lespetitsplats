import { Component } from "../models/component.ts";
import { Filters } from "../models/filters.ts";
import { FiltersState } from "../state/filtersState.ts";

export class FilterComponent implements Component {
  private option: string;
  private state: FiltersState;
  private allFilters: {
    availableFilters: Filters;
    selectedFilters: Filters;
  };
  private dropdownUl: HTMLUListElement;
  private closeCross: HTMLImageElement;
  private dropdownContent: HTMLDivElement;
  private selectionFilters: HTMLDivElement;

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
    this.dropdownUl = document.createElement("ul");
    this.closeCross = document.createElement("img");
    this.dropdownContent = document.createElement("div");
    this.selectionFilters = document.createElement("div");
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

    filterListContainer.appendChild(btnOption);

    //DropdownList

    const dropdownList = this.getMenuListDom();

    filterListContainer.appendChild(dropdownList);

    /////AdEventListener
    //button

    btnOption.addEventListener("click", () => {
      if (this.dropdownContent.style.display === "none") {
        this.dropdownContent.style.display = "flex";
        btnOption.style.borderBottomRightRadius = "0";
        btnOption.style.borderBottomLeftRadius = "0";
        arrowElement.classList.add("arrow-up");
        arrowElement.classList.remove("arrow-down");
      } else {
        this.dropdownContent.style.display = "none";
        btnOption.style.borderBottomRightRadius = "11px";
        btnOption.style.borderBottomLeftRadius = "11px";
        arrowElement.classList.add("arrow-down");
        arrowElement.classList.remove("arrow-up");
      }
    });

    //Toggle selected filters
    return filterListContainer;
  }

  private getMenuListDom(): HTMLDivElement {
    const filtersDisplay = this.sortFiltersByOptions(this.option);

    this.dropdownContent.classList.add("dropdown-content");
    this.dropdownContent.id = `dropdown-content-${this.option}`;

    this.dropdownUl.classList.add("dropdown-ul");
    this.dropdownUl.id = `dropdown-ul-${this.option}`;

    // Search bar
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

    this.dropdownContent.appendChild(formFilter);

    //Selected elements

    this.selectionFilters.classList.add("dropdown-selection");

    this.dropdownContent.appendChild(this.selectionFilters);

    // List items
    filtersDisplay.forEach((filter: string) => {
      const filterElement = document.createElement("li");
      filterElement.classList.add("filtered-element-list");
      filterElement.textContent = filter;
      const elementText = filter?.replace(/\s+/g, "").toLowerCase();
      this.closeCross.setAttribute("src", "assets/icons/cross.svg");
      this.closeCross.classList.add(
        "close-element",
        `close-element-${elementText}`
      );
      filterElement.addEventListener("click", () => {
        this.toggleFilterSelection(filterElement);
      });

      filterElement.appendChild(this.closeCross);
      this.dropdownUl.appendChild(filterElement);
    });
    this.dropdownContent.appendChild(this.dropdownUl);

    return this.dropdownContent;
  }

  private sortFiltersByOptions(option: string): Set<string> {
    this.allFilters.availableFilters = this.state.getFiltersAvailable();

    switch (option.toLowerCase()) {
      case "ingrédients":
        return this.allFilters.availableFilters.ingredients;
      case "appareils":
        return this.allFilters.availableFilters.appliances;
      case "ustensiles":
        return this.allFilters.availableFilters.ustensils;
      default:
        return new Set();
    }
  }

  private toggleFilterSelection(element: any) {
    if (!element.classList.contains("element-selected")) {
      element.classList.add("element-selected");
      this.closeCross.style.visibility = "visible";

      this.selectionFilters.appendChild(element);

      this.state.addFilter(element);
    } else {
      element.classList.remove("element-selected");
      this.closeCross.style.visibility = "hidden";

      this.dropdownUl.appendChild(element);

      this.state.removeFilter(element);
    }
  }
}
