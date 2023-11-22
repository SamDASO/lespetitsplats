//Tags component

export function getTagsCardDom() {
  const tagsArray: string[] = ["Ingrédients", "Appareils", "Ustensiles"];
  const containers: HTMLDivElement[] = [];

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

    const dropdownContent = document.createElement("div");
    dropdownContent.classList.add("dropdown-content");
    dropdownContent.classList.add("display-none");

    const formFilter = document.createElement("form");
    formFilter.classList.add("dropdown-search");

    const inputForm = document.createElement("input");
    inputForm.classList.add("dropdown-input");
    inputForm.setAttribute("type", "text");
    inputForm.setAttribute("name", "search");
    inputForm.setAttribute("placeholder", "");

    const btnForm = document.createElement("button");
    btnForm.classList.add("dropdown-btn");

    containerFilters.appendChild(buttonTags);
    buttonTags.appendChild(arrowDown);
    containerFilters.appendChild(dropdownContent);
    dropdownContent.appendChild(formFilter);
    formFilter.appendChild(inputForm);
    formFilter.appendChild(btnForm);

    containers.push(containerFilters);
  });

  return containers;
}
