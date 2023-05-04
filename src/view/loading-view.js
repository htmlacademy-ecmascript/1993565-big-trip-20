import { createElement } from '../render.js';

function createLoadTemplate() {
  return `<div class="page-body__container">
    <section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <p class="trip-events__msg">Loading...</p>
    </section>
  </div>`;
}

export default class LoadView {
  getTemplate() {
    return createLoadTemplate();
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
