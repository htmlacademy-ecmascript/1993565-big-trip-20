import AbstractView from '../framework/view/abstract-view.js';


const createNewTripEventListTemplate = () => `
  <ul class="trip-events__list">
          </ul>
          `;


export default class TripEventListView extends AbstractView {
  get template() {
    return createNewTripEventListTemplate();
  }

}
