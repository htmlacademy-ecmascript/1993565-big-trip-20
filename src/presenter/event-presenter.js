import { render } from '../render.js';

import SortView from '../view/sort-view.js';
import TripEventListView from '../view/trip-events-list-view.js';
import PointTripView from '../view/point-trip-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class BoardPresenter {
  container = null;

  tripListComponent = new TripEventListView();

  constructor({ container, destinationsModel }) {
    this.container = container;
    this.destinationsModel = destinationsModel;
  }

  init() {
    this.boardDestinations = [...this.destinationsModel.getDestinations()];

    render(new SortView(), this.container);
    render(this.tripListComponent, this.container);
    render(
      new EditPointView({ trip: this.boardDestinations[0] }),
      this.tripListComponent.getElement()
    );


    for (let i = 0; i < this.boardDestinations.length; i++) {
      render(
        new PointTripView({ pointTrip: this.boardDestinations[i] }),
        this.tripListComponent.getElement()
      );
    }
  }
}
