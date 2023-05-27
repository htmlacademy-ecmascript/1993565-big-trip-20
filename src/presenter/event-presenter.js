import {render} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripEventListView from '../view/trip-events-list-view.js';
import NewEmptyListView from '../view/list-empty-view.js';
import TripPresenter from './trip-presenter.js';
import {updateItem} from '../utils.js';

export default class BoardPresenter {
  #container = null;
  #destinationsModel = null;

  #tripListComponent = new TripEventListView();
  #sortComponent = null;

  #tripPoints = [];
  #tripsPresenters = new Map();

  constructor({ container, destinationsModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
  }


  #handleChange = (updatedTask) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedTask);
    this.#tripsPresenters.get(updatedTask.id).init(updatedTask);
  };

  init() {
    const tripPoints = [...this.#destinationsModel.destinations];


    //render(new SortView(), this.#container);
    render(this.#tripListComponent, this.#container);


    for (const tripPoint of tripPoints) {
      const tripPointsPresenter = new TripPresenter({tripPointsContainer: this.#tripListComponent.element, onDataChange: this.#handleChange, onModeChange: this.#handleModeChange});
      tripPointsPresenter.init(tripPoint);
      this.#tripsPresenters.set(tripPoint.id, tripPointsPresenter);

    }
    if (tripPoints.length === 0) {
      render(new NewEmptyListView(), this.#container);
    }

  }


  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи
    // - Очищаем список
    // - Рендерим список заново
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container);
  }

  #handleModeChange = () => {
    this.#tripsPresenters.forEach((presenter) => presenter.resetView());
  };


}
