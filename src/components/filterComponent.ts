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
  private dropdownDivList: HTMLDivElement;
  private dropdownContent: HTMLDivElement;
  private selectionFilters: HTMLDivElement;
  private inputForm: HTMLInputElement;

  constructor(state: FiltersState, option: string) {
    this.option = option;
    this.state = state;
    this.dropdownDivList = document.createElement("div");
    this.dropdownContent = document.createElement("div");
    this.selectionFilters = document.createElement("div");
    this.inputForm = document.createElement("input");
  }

  render(): HTMLElement {
    //////////////////button

    const btnOption = document.createElement("div");
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

    const filterListContainer = document.createElement("div");
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
        btnOption!.style.borderBottomRightRadius = "0";
        btnOption!.style.borderBottomLeftRadius = "0";
        arrowElement.classList.add("arrow-up");
        arrowElement.classList.remove("arrow-down");
      } else {
        this.dropdownContent.style.display = "none";
        btnOption!.style.borderBottomRightRadius = "11px";
        btnOption!.style.borderBottomLeftRadius = "11px";
        arrowElement.classList.add("arrow-down");
        arrowElement.classList.remove("arrow-up");
      }
    });

    return filterListContainer!;
  }

  private getMenuListDom(): HTMLDivElement {
    this.dropdownContent.classList.add("dropdown-content");
    this.dropdownContent.id = `dropdown-content-${this.option}`;

    this.dropdownDivList.classList.add("dropdown-divList");
    this.dropdownDivList.id = `dropdown-ul-${this.option}`;

    // Search bar
    const formFilter = document.createElement("form");
    formFilter.classList.add("dropdown-search");
    formFilter.id = `dropdown-search-${this.option}`;

    this.inputForm.classList.add("dropdown-input");
    this.inputForm.id = `dropdown-input-${this.option}`;
    this.inputForm.setAttribute("type", "text");
    this.inputForm.setAttribute("name", "search");
    this.inputForm.setAttribute("placeholder", "");

    const btnForm = document.createElement("button");
    btnForm.classList.add("dropdown-btn");
    const imgBtnContent = document.createElement("img");
    imgBtnContent.setAttribute("src", "./assets/icons/search-filter.svg");
    imgBtnContent.setAttribute("alt", "research button");

    btnForm.appendChild(imgBtnContent);
    formFilter.appendChild(this.inputForm);
    formFilter.appendChild(btnForm);

    this.dropdownContent.appendChild(formFilter);

    //Selected elements

    this.selectionFilters.classList.add("dropdown-selection");

    this.dropdownContent.appendChild(this.selectionFilters);

    //dropdownList
    this.dropdownContent.appendChild(this.dropdownDivList);

    this.renderFiltersList();

    return this.dropdownContent;
  }

  public renderFiltersList() {
    this.dropdownDivList.innerHTML = "";
    this.selectionFilters.innerHTML = "";

    const selectedFilters =
      this.state.getFilters().selectedFilters[this.option];
    const availableFiltersSet =
      this.state.getFilters().availableFilters[this.option];

    // List items - selected Filters
    selectedFilters.forEach((filter: string) => {
      this.selectionFilters.appendChild(
        this.createHtmlListFilter(filter, true)
      );
    });

    //List items - available Filters
    const sortedAvailableFilters = [...availableFiltersSet].sort((a, b) =>
      a.localeCompare(b)
    );

    sortedAvailableFilters.forEach((filter: string) => {
      this.dropdownDivList.appendChild(
        this.createHtmlListFilter(filter, false)
      );
    });

    // Search by option
    this.inputForm.addEventListener("input", () =>
      this.filterAvailableFilters(this.inputForm.value)
    );

    // List items - available Filters
  }

  private filterAvailableFilters(searchTerm: string) {
    const availableFiltersSet =
      this.state.getFilters().availableFilters[this.option];

    const filteredFilters = [...availableFiltersSet]
      .filter((filter) =>
        filter.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.localeCompare(b));

    this.dropdownDivList.innerHTML = ""; // Clear the existing list

    filteredFilters.forEach((filter: string) => {
      this.dropdownDivList.appendChild(
        this.createHtmlListFilter(filter, false)
      );
    });
  }

  private createHtmlListFilter(
    filter: string,
    isSelected: boolean
  ): HTMLParagraphElement {
    const filterElement = document.createElement("p");
    filterElement.classList.add("filtered-element-list");
    filterElement.classList.add(`filtered-element-${this.option}`);
    filterElement.textContent = filter;
    filterElement.dataset.option = this.option;

    const closeCross = document.createElement("img");
    const filterText = filterElement.textContent as string;

    if (isSelected) {
      filterElement.classList.add("filtered-element-select");

      const elementText = filter?.replace(/\s+/g, "").toLowerCase();

      closeCross.setAttribute("src", "assets/icons/cross.svg");
      closeCross.setAttribute("alt", "close");
      closeCross.classList.add("close-element", `close-element-${elementText}`);

      filterElement.appendChild(closeCross);
    } else {
      filterElement.className = "";
      filterElement.classList.add("filtered-element-list");
      filterElement.classList.add(`filtered-element-${this.option}`);
    }

    filterElement.addEventListener("click", () => {
      if ((filterElement.className = ".filtered-element-select")) {
        filterElement.className = "";
        filterElement.classList.add("filtered-element-list");
        filterElement.classList.add(`filtered-element-${this.option}`);
        this.state.toggleFiltersSelection(this.option, filterText);
      } else {
        filterElement.appendChild(closeCross);
        this.state.toggleFiltersSelection(this.option, filterText);
      }
    });

    return filterElement;
  }

  update() {
    this.renderFiltersList();
  }
}
