import { Component } from "../models/component.ts";
import { FiltersState } from "../state/filtersState.ts";

const filterLabels = new Map<string, string>([
  ["ingredients", "Ingrédients"],
  ["appliances", "Appareils"],
  ["ustensils", "Ustensiles"],
]);

export class FilterComponent implements Component {
  private option: string;
  private state: FiltersState;
  private dropdownUl: HTMLUListElement;
  private dropdownContent: HTMLDivElement;
  private selectionFilters: HTMLDivElement;

  constructor(state: FiltersState, option: string) {
    this.option = option;
    this.state = state;
    this.dropdownUl = document.createElement("ul");
    this.dropdownContent = document.createElement("div");
    this.selectionFilters = document.createElement("div");
  }

  render(): HTMLElement {
    //////////////////button

    const btnOption = document.createElement("button");
    btnOption.classList.add("filters-btn");
    btnOption.id = `filters-btn-${this.option}`;
    btnOption.setAttribute("aria-haspopup", "listbox");
    btnOption.setAttribute("role", "button");
    btnOption.textContent = filterLabels.get(this.option) ?? "undefined";

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

    return filterListContainer;
  }

  private getMenuListDom(): HTMLDivElement {
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
    this.dropdownContent.appendChild(this.dropdownUl);

    this.renderFiltersList();

    return this.dropdownContent;
  }

  private renderFiltersList() {
    this.dropdownUl.innerHTML = "";
    // List items
    this.state
      .getFilters()
      .selectedFilters[this.option].forEach((filter: string) => {
        this.selectionFilters.append(this.createHtmlListFilter(filter, true));
      });
    this.state
      .getFilters()
      .availableFilters[this.option].forEach((filter: string) => {
        this.dropdownUl.append(this.createHtmlListFilter(filter, false));
      });
  }

  private createHtmlListFilter(filter: string, isSelected: boolean) {
    const filterElement = document.createElement("li");
    filterElement.textContent = filter;

    if (isSelected) {
      filterElement.classList.add("filtered-element-select");

      const elementText = filter?.replace(/\s+/g, "").toLowerCase();
      const closeCross = document.createElement("img");
      closeCross.setAttribute("src", "assets/icons/cross.svg");
      closeCross.classList.add("close-element", `close-element-${elementText}`);

      filterElement.appendChild(closeCross);
    } else {
      filterElement.classList.add("filtered-element-list");
    }

    return filterElement;
  }
}
