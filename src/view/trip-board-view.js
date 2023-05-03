import { createElement } from '../render.js';


function createTripBoardTemplate() { return ( `<section class="trip-events">  </section>`) }

export default class EventTripBoardView {
  getTemplate() {
    return createTripBoardTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}



