import { createElement } from '../render.js';

const createNewTripEventListTemplate = () => `
  <ul class="trip-events__list">
          </ul>
          `;


export default class TripEventListView {
  getTemplate() {
    return createNewTripEventListTemplate();
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
