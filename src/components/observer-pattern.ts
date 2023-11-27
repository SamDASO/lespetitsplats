//observer component - filter
/*interface FilterObserver {
  updateIngredients(ingredients: string[]){
    const IngredientBtn = document.querySelector(`.filters-btn:contains("Ingrédients")`);

  };
  updateAppliance(appliance: string[]){};
  updateUstensils(ustensils: string[]){};
}

//observer and subject component - filters
interface FilterSubject {
    private observers: FilterObserver[] = [];

  addObserver(observer: FilterObserver) {
    this.observers.push(observer);
    }

    removeObserver(observer: FilterObserver) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }}

      notifyIngredients(ingredients: string[]) {
    this.observers.forEach(observer => observer.updateIngredients(ingredients));
  }

  notifyAppliance(appliance: string[]) {
    this.observers.forEach(observer => observer.updateAppliance(appliance));
  }

  notifyUstensils(ustensils: string[]) {
    this.observers.forEach(observer => observer.updateUstensils(ustensils));
  }

}

//updates functions */
