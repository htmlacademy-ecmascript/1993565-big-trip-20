import { render, remove } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripEventListView from '../view/trip-events-list-view.js';
import NewEmptyListView from '../view/list-empty-view.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import NewTripPresenter from './new-trip-presenter.js';
import TripPresenter from './trip-presenter.js';
import { SORT_TYPE, UPDATETYPE, USERACTION, FILTER_TYPE } from '../const.js';
import { sortByPrice, sortByDay, sortByDuration } from '../sort-utils.js';
import { filter } from '../utils.js';

const TRIP_COUNT_PER_STEP = 7;

export default class BoardPresenter {
  #container = null;
  #tripsModel = null;

  #tripListComponent = new TripEventListView();
  #sortComponent = null;

  #tripsPresenters = new Map();
  #destinationMap = new Map();
  #destinationArr = [];
  #noTripComponent = null;
  #renderedTripCount = TRIP_COUNT_PER_STEP;
  #filterModel = null;
  #newEventButtonComponent = null;
  #newTripPresenter = null;


  #currentSortType = SORT_TYPE.DAY;
  #filterType = FILTER_TYPE.EVERYTHING;

  constructor({ container, tripsModel, destinationModels, filterModel, onNewTripDestroy }) {
    this.#container = container;
    this.#tripsModel = tripsModel;
    this.#filterModel = filterModel;
    this.#tripsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    if (destinationModels) {
      for (const destination of destinationModels.destinations) {
        this.#destinationMap.set(destination.id, destination);
      }
    }

    this.#destinationArr = destinationModels.destinations;

    this.#newTripPresenter = new NewTripPresenter({
      tripListContainer: this.#tripListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewTripDestroy,
      destinationArr: this.#destinationArr
    });
  }

  get trips() {
    this.#filterType = this.#filterModel.filter;
    const trips = this.#tripsModel.destinations;
    const filteredTrips = filter[this.#filterType](trips);


    switch (this.#currentSortType) {
      case SORT_TYPE.DAY:
        return filteredTrips.sort(sortByDay);
      case SORT_TYPE.TIME_LONG:
        return filteredTrips.sort(sortByDuration);
      case SORT_TYPE.PRICE_UP:
        return filteredTrips.sort(sortByPrice);
    }
    return filteredTrips;
  }

  init() {
    this.#renderList();
  }


  createTrip() {
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.setFilter(UPDATETYPE.MAJOR, FILTER_TYPE.EVERYTHING);
    this.#newTripPresenter.init();
  }


  #renderNewEventButton() {
    this.#newEventButtonComponent = new NewEventButtonView({
      onClick: this.#handleNewEventButtonClick
    });
  }

  #handleNewEventButtonClick = () => {
    const tripCount = this.trips.length;
    const newRenderedTaskCount = Math.min(tripCount, this.#renderedTripCount + TRIP_COUNT_PER_STEP);
    const trips = this.trips.slice(this.#renderedTripCount, newRenderedTaskCount);
    this.#renderTrips(trips);
    this.#renderedTripCount = newRenderedTaskCount;
    if (this.#renderedTripCount >= tripCount) {
      remove(this.#newEventButtonComponent);
    }
  };

  #renderTrips(trips) {
    trips.forEach((trip) => this.#renderTripPoints(trip));
  }

  #renderNoTrips() {
    this.#noTripComponent = new NewEmptyListView({
      filterType: this.#filterType
    });

    render(this.#noTripComponent, this.#container);
  }

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case USERACTION.UPDATE_TRIP:
        this.#tripsModel.updateTrip(updateType, update);
        break;
      case USERACTION.ADD_TRIP:
        this.#tripsModel.addTrip(updateType, update);
        break;
      case USERACTION.DELETE_TRIP:
        this.#tripsModel.deleteTrip(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UPDATETYPE.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#tripsPresenters.get(data.id).init(data);
        break;
      case UPDATETYPE.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearList();
        this.#renderList();
        break;
      case UPDATETYPE.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)

        this.#clearList({ resetRenderedTaskCount: true, resetSortType: true });
        this.#renderList();
        break;
    }
  };

  #clearList({ resetRenderedTripCount = false, resetSortType = false } = {}) {
    this.#newTripPresenter.destroy();
    this.#tripsPresenters.forEach((presenter) => presenter.destroy());
    this.#tripsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#newEventButtonComponent);

    if (this.#noTripComponent) {
      remove(this.#noTripComponent);
    }
    if (resetRenderedTripCount) {
      this.#renderedTripCount = TRIP_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this.#renderedTripCount = Math.min(this.trips.length, this.#renderedTripCount);
    }


    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DAY;
    }
  }


  #renderList() {

    if (this.trips.length === 0) {
      this.#renderNoTrips();
      return;
    }
    this.#renderSort();
    render(this.#tripListComponent, this.#container);
    this.#renderTripPoints();
    if (this.trips.length > this.#renderedTripCount) {
      this.#renderNewEventButton();
    }
  }

  #renderTripList() {
    const tripCount = this.trips.length;
    const trips = this.trips.slice(0, Math.min(tripCount, TRIP_COUNT_PER_STEP));
    render(this.#tripListComponent, this.#container);
    this.#renderTripPoints(trips);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;


    this.#clearList({ resetRenderedTripCount: true, });

    this.#renderList();
  };

  #renderTripPoints() {
    for (const trip of this.trips) {
      const tripPointsPresenter = new TripPresenter({
        tripPointsContainer: this.#tripListComponent.element,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange,
      });
      tripPointsPresenter.init(trip, this.#destinationArr);
      this.#tripsPresenters.set(trip.id, tripPointsPresenter);
    }
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#container);
  }

  #handleModeChange = () => {
    this.#newTripPresenter.destroy();
    this.#tripsPresenters.forEach((presenter) => presenter.resetView());
  };
}
