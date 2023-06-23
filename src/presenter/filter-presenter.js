import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/trip-filters-view.js';
import { FILTER } from '../utils.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #tripsModel = null;

  #filterComponent = null;

  constructor({ filterContainer, filterModel, tripsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#tripsModel = tripsModel;

    this.#tripsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const trips = this.#tripsModel.destinations;

    return Object.values(FilterType).map((type) => ({
      type,
      count: FILTER[type](trips).length,
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FiltersView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });
    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
