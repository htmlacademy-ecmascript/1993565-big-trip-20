import {render} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripEventListView from '../view/trip-events-list-view.js';
import NewEmptyListView from '../view/list-empty-view.js';
import TripPresenter from './trip-presenter.js';
import {updateItem} from '../utils.js';
import {SORT_TYPE} from '../const.js';
import {sortByPrice, sortByDay, sortByDuration} from '../sort-utils.js';


export default class BoardPresenter {
  #container = null;
  #destinationsModel = null;

  #tripListComponent = new TripEventListView();
  #sortComponent = null;

  #tripPoints = [];
  #tripsPresenters = new Map();

  #currentSortType = SORT_TYPE.DAY;
  #sourcedBoardTrips = [];

 constructor({ container, destinationsModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
  }

 init() {
    this.#tripPoints = [...this.#destinationsModel.destinations];
    this.#sourcedBoardTrips = [...this.#destinationsModel.destinations];
    this.#renderSort();
    console.log(this.#tripPoints);
    this.#renderTripList();
    this.#renderTripPoints();


    if (this.#tripPoints.length === 0) {
      render(new NewEmptyListView(), this.#container);
    }

  }

  #handleChange = (updatedTrip) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedTrip);
    this.#sourcedBoardTrips = updateItem(this.#sourcedBoardTrips, updatedTrip);
    this.#tripsPresenters.get(updatedTrip.id).init(updatedTrip);
  };


  #sortTrips(sortType) {
    switch (sortType) {
      case SORT_TYPE.DAY:
        this.#tripPoints.sort(sortByDay);
        break;
      case SORT_TYPE.TIME_LONG:
        this.#tripPoints.sort(sortByDuration);
        break;
      case SORT_TYPE.PRICE_UP:
        this.#tripPoints.sort(sortByPrice);
        break;
      default:
        this.#tripPoints = [...this.#sourcedBoardTrips];
    }

    this.#currentSortType = sortType;
  }


  #renderTripList() {
       render(this.#tripListComponent, this.#container);

  }

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи

    if (this.#currentSortType === sortType) {
      return;
    }

     this.#sortTrips(sortType);
    // - Очищаем список
      this.#clearTripList();
    // - Рендерим список заново
      this.#renderTripPoints();
  };

  #renderTripPoints() {

    for (const tripPoint of this.#tripPoints) {
      const tripPointsPresenter = new TripPresenter({tripPointsContainer: this.#tripListComponent.element, onDataChange: this.#handleChange, onModeChange: this.#handleModeChange});
      tripPointsPresenter.init(tripPoint);
      this.#tripsPresenters.set(tripPoint.id, tripPointsPresenter);
    }
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container);
  }

  #handleModeChange = () => {
    this.#tripsPresenters.forEach((presenter) => presenter.resetView());
  };

   #clearTripList() {
    this.#tripsPresenters.forEach((presenter) => presenter.destroy());
    this.#tripsPresenters.clear();
  }

}
