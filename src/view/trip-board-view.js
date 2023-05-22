import AbstractView from '../framework/view/abstract-view.js';


function createTripBoardTemplate() {
  return '<section class="trip-events">  </section>';
}

export default class EventTripBoardView extends AbstractView {
  get template() {
    return createTripBoardTemplate();
  }


}
