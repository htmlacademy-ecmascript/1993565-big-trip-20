import {render, replace} from '../framework/render.js';

import SortView from '../view/sort-view.js';
import TripEventListView from '../view/trip-events-list-view.js';
import PointTripView from '../view/point-trip-view.js';
import EditPointView from '../view/edit-point-view.js';
import NewEmptyListView from '../view/list-empty-view.js';

export default class BoardPresenter {
  #container = null;
  #destinationsModel = null;
  #boardDestinations = null;
  #tripListComponent = new TripEventListView();

  constructor({ container, destinationsModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    const tripPoints = [...this.#destinationsModel.destinations];

    render(new SortView(), this.#container);
    render(this.#tripListComponent, this.#container);

    for (const tripPoint of tripPoints) {
      this.#renderTripEdit(tripPoint);

    }


    if (tripPoints.length === 0) {
      render(new NewEmptyListView(), this.#container);
    }

  }

  #renderTrip(trip) {
    const tripComponent = new PointTripView({trip});
    render(tripComponent, this.#tripListComponent.element);
  }

  #renderTripEdit(trip) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const tripPointComponent = new PointTripView({
      trip,
      onRollupClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const tripPointEditComponent = new EditPointView({
      trip,
      onRollupClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceFormToPoint() {
      replace(tripPointComponent, tripPointEditComponent);
    }

    function replacePointToForm() {
      replace(tripPointEditComponent, tripPointComponent);
    }

    render(tripPointComponent, this.#tripListComponent.element);
  }


}
