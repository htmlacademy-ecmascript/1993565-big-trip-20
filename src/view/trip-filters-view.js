import AbstractView from '../framework/view/abstract-view.js';

const createFiltersTemplate = (filters, currentFilterType) => {
  let result = '<div class="trip-main__trip-controls  trip-controls"><div class="trip-controls__filters"><h2 class="visually-hidden">Filter events</h2><form class="trip-filters" action="#" method="get">';
  for (const filter of filters) {
    result += `<div class="trip-filters__filter">
                 <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}" ${filter.type === currentFilterType ? 'checked' : ''}>
                 <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type}</label>
               </div>`;
  }

  result +=
    '<button class="visually-hidden" type="submit">Accept filter</button></form></div></div>';
  return result;
};

export default class FiltersView extends AbstractView {
  #filters;
  #currentFilterType;
  #handleFilterTypeChange;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #filterChangeHandler = (evt) => {
    this.#handleFilterTypeChange(evt.target.value);
  };
}
