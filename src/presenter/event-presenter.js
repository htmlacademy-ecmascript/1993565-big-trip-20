import {render} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripEventListView from '../view/trip-events-list-view.js';
import NewEmptyListView from '../view/list-empty-view.js';
import TripPresenter from './trip-presenter.js';
//import {updateItem} from '../utils.js';
import {SORT_TYPE, UPDATETYPE, USERACTION} from '../const.js';
import {sortByPrice, sortByDay, sortByDuration} from '../sort-utils.js';

const TRIP_COUNT_PER_STEP = 7;

export default class BoardPresenter {
  #container = null;
  #tripsModel = null;

  #tripListComponent = new TripEventListView();
  #sortComponent = null;

  //#tripPoints = [];
  #tripsPresenters = new Map();
  #destinationMap = new Map();
  #destinationArr = [];



  #currentSortType = SORT_TYPE.DAY;
  //#sourcedBoardTrips = [];

  constructor({ container, tripsModel, destinationModels }) {
    this.#container = container;
    this.#tripsModel = tripsModel;
    this.#tripsModel.addObserver(this.#handleModelEvent);
    if (destinationModels) {
      for (const destination of destinationModels.destinations) {
        this.#destinationMap.set(destination.id, destination);
      }
    }

    this.#destinationArr = destinationModels.destinations;

  }

  get trips() {
    switch (this.#currentSortType) {
      case SORT_TYPE.DAY:
       return [...this.#tripsModel.destinations].sort(sortByDay);
      case SORT_TYPE.TIME_LONG:
       return [...this.#tripsModel.destinations].sort(sortByDuration);
      case SORT_TYPE.PRICE_UP:
       return [...this.#tripsModel.destinations].sort(sortByPrice);
      }
    return this.#tripsModel.destinations;
  }

  init() {
    //this.#tripPoints = [...this.#tripsModel.destinations];
    //this.#sourcedBoardTrips = [...this.#tripsModel.destinations];
    this.#renderSort();
    this.#renderTripList();
    this.#renderTripPoints();


    /*if (this.#tripPoints.length === 0) {
      render(new NewEmptyListView(), this.#container); */
    }




  /* #handleChange = (updatedTrip) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedTrip);
    this.#sourcedBoardTrips = updateItem(this.#sourcedBoardTrips, updatedTrip);
    this.#tripsPresenters.get(updatedTrip.id).init(updatedTrip, this.#destinationArr);
  }; */

     #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case USERACTION.UPDATE_TASK:
        this.#tripsModel.updateTask(updateType, update);
        break;
      case USERACTION.ADD_TASK:
        this.#tripsModel.addTask(updateType, update);
        break;
      case USERACTION.DELETE_TASK:
        this.#tripsModel.deleteTask(updateType, update);
        break;
  };
}

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
        break;
      case UPDATETYPE.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
  };
}


  /* #sortTrips(sortType) {
    /*switch (sortType) {
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
  } */


  #renderTripList() {
    const tripCount = this.trips.length;
    const trips = this.trips.slice(0, Math.min(tripCount, TRIP_COUNT_PER_STEP));
    render(this.#tripListComponent, this.#container);
    this.#renderTripPoints(trips);

  }

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи

    if (this.#currentSortType === sortType) {
      return;
    }

    //this.#sortTrips(sortType);
    this.#currentSortType = sortType;
    // - Очищаем список
    this.#clearTripList();
    // - Рендерим список заново
    this.#renderTripPoints();
  };

  #renderTripPoints() {
    for (const trip of this.trips) {
      const tripPointsPresenter = new TripPresenter({tripPointsContainer: this.#tripListComponent.element, onDataChange: this.#handleViewAction, onModeChange: this.#handleModeChange});
      tripPointsPresenter.init(trip, this.#destinationArr);
      this.#tripsPresenters.set(trip.id, tripPointsPresenter);
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
