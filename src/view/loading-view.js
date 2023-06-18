import AbstractView from '../framework/view/abstract-view.js';

function createLoadTemplate() {
  return `<div class="page-body__container">
    <section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <p class="trip-events__msg">Loading...</p>
    </section>
  </div>`;
}

export default class LoadView extends AbstractView {
  get template() {
    return createLoadTemplate();
  }
}
