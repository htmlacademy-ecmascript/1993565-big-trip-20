import {render} from '../render.js';
import EventTripBoardView from '../view/trip-board-view.js';
import SortView from '../view/sort-view.js';
import TripEventListView from '../view/trip-events-list-view.js';
import PointTripView from '../view/point-trip-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class BoardPresenter {
  boardComponent = new EventTripBoardView();
  taskListComponent = new TripEventListView();

constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

init() {
    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.taskListComponent, this.boardComponent.getElement());
    render(new EditPointView(), this.taskListComponent.getElement());


     for (let i = 0; i < 3; i++) {
      render(new PointTripView(), this.taskListComponent.getElement());
    }
 }
}
