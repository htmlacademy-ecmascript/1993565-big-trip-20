import { render, remove, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripEventListView from '../view/trip-events-list-view.js';
import NewEmptyListView from '../view/list-empty-view.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import NewTripPresenter from './new-trip-presenter.js';
import TripPresenter from './trip-presenter.js';
import LoadView from '../view/loading-view.js';
import { SORT_TYPE, UPDATETYPE, USERACTION, FILTER_TYPE } from '../const.js';
import { sortByPrice, sortByDay, sortByDuration } from '../sort-utils.js';
import { filter } from '../utils.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TRIP_COUNT_PER_STEP = 7;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #container = null;
  #tripsModel = null;

  #tripListComponent = new TripEventListView();
  #sortComponent = null;

  #tripsPresenters = new Map();

  #destinationArr = new Map();
  #noTripComponent = null;
  #renderedTripCount = TRIP_COUNT_PER_STEP;
  #filterModel = null;
  #newEventButtonComponent = null;
  #newTripPresenter = null;
  #loadingComponent = new LoadView();
  #isLoading = true;
  #destinationMap = new Map();
  #typeToOffersMap = new Map();
  #offersModel;

  #currentSortType = SORT_TYPE.DAY;
  #filterType = FILTER_TYPE.EVERYTHING;
    #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({
    container,
    tripsModel,
    destinationModels,
    filterModel,
    offersModel,
    onNewTripDestroy,
  }) {
    this.#container = container;
    this.#tripsModel = tripsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;

    this.#tripsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    if (destinationModels) {
      for (const destination of destinationModels.destinations) {
        this.#destinationMap.set(destination.id, destination);
      }
    }

    this.#destinationArr = this.#destinationMap;

    this.#newTripPresenter = new NewTripPresenter({
      tripListContainer: this.#tripListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewTripDestroy,
      destinationArr: this.#destinationArr,
      typeToOffersMap: this.#typeToOffersMap
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
      onClick: this.#handleNewEventButtonClick,
    });
  }

  #handleNewEventButtonClick = () => {
    const tripCount = this.trips.length;
    const newRenderedTaskCount = Math.min(
      tripCount,
      this.#renderedTripCount + TRIP_COUNT_PER_STEP
    );
    const trips = this.trips.slice(
      this.#renderedTripCount,
      newRenderedTaskCount
    );
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
      filterType: this.#filterType,
    });

    render(this.#noTripComponent, this.#container);
  }

  #handleViewAction = async (actionType, updateType, update) => {
  this.#uiBlocker.block();
    switch (actionType) {
      case USERACTION.UPDATE_TRIP:
        this.#tripsPresenters.get(update.id).setSaving();
        try {
          await this.#tripsModel.updateTrip(updateType, update);
        } catch (err) {
          this.#tripsPresenters.get(update.id).setAborting();
        }
        break;
      case USERACTION.ADD_TRIP:
        this.#newTripPresenter.setSaving();
        try {
          await this.#tripsModel.addTrip(updateType, update);
        } catch (err) {
          this.#newTripPresenter.setAborting();
        }
        break;
      case USERACTION.DELETE_TRIP:
        this.#tripsPresenters.get(update.id).setDeleting();
         this.#tripsPresenters.get(update.id).setDeleting();
        try {
          await this.#tripsModel.deleteTrip(updateType, update);
        } catch (err) {
          this.#tripsPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
  console.log(updateType, 'updateType!!!');
    switch (updateType) {

      case UPDATETYPE.PATCH:
        this.#tripsPresenters.get(data.id).init(data, this.#destinationArr);
        break;
      case UPDATETYPE.MINOR:

        this.#clearList();
        this.#renderList();
        break;
      case UPDATETYPE.MAJOR:
        this.#clearList({ resetRenderedTripCount: true, resetSortType: true });
        this.#renderList();
        break;
      case UPDATETYPE.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        for (const offerByType of this.#offersModel.offers) {
          this.#typeToOffersMap.set(offerByType.type, offerByType.offers);
        }
        this.#renderList();
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #clearList({ resetRenderedTripCount = false, resetSortType = false } = {}) {
    this.#newTripPresenter.destroy();
    this.#tripsPresenters.forEach((presenter) => presenter.destroy());
    this.#tripsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#newEventButtonComponent);
    remove(this.#loadingComponent);

    if (this.#noTripComponent) {
      remove(this.#noTripComponent);
    }
    if (resetRenderedTripCount) {
      this.#renderedTripCount = TRIP_COUNT_PER_STEP;
    } else {

      this.#renderedTripCount = Math.min(
        this.trips.length,
        this.#renderedTripCount
      );
    }

    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DAY;
    }
  }

  #renderList() {
    render(this.#tripListComponent, this.#container);
    this.#renderSort();
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.trips.length === 0) {
      this.#renderNoTrips();
      return;
    }

    this.#renderTripPoints();

    if (this.trips.length > this.#renderedTripCount) {
      this.#renderNewEventButton();
    }

  }


  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearList({ resetRenderedTripCount: true });

    this.#renderList();
  };

  #renderTripPoints() {
    for (const trip of this.trips) {

      const tripPointsPresenter = new TripPresenter({
        tripPointsContainer: this.#tripListComponent.element,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange,
      });
      tripPointsPresenter.init(trip, this.#destinationArr,this.#typeToOffersMap);
      this.#tripsPresenters.set(trip.id, tripPointsPresenter);
    }
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#newTripPresenter.destroy();
    this.#tripsPresenters.forEach((presenter) => presenter.resetView());
  };
}
