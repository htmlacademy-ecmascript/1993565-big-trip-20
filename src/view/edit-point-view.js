import { createElement } from '../render.js';
import {
  OFFERS_OPTIONS,
  OFFERS_TYPE,
  DESTINATIONS_DESCRIPTIONS,
} from '../const.js';
import {
  humanizeDueDate,
  generateDate,
  getRandomArrayElement,
  getRandomInteger,
  humanizeHour,
  duration,
} from '../utils.js';

const createEditPointTemplate = (tripPoint) => {
  const {
    basePrice,
    destination,
    /*dateFrom, dateTo,*/ type /*offers*/,
  } = tripPoint;

  const createType = (currentType) =>
    OFFERS_TYPE.map(
      (pointType) =>
        `<div class="event__type-item">
   <input id="event-type-${pointType}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${
  currentType === 'checked'
}>
   <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}">${pointType}</label>
   </div>`
    ).join('');

  const typeComponent = createType(type);
  const createOfferTemplate = (offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-comfort-1">
        <span class="event__offer-title">${getRandomArrayElement(
    OFFERS_OPTIONS
  )}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${getRandomInteger(35, 100)}</span>
      </label>
    </div>`;

  const createOffersTemplate = (offers) => {
    let result = '';
    for (const offer of offers) {
      result += createOfferTemplate(offer);
    }

    return result;
  };

  //const photoComponent = destination.find((el) => (el.id === destination)).pictures[0].src;
  //const photoDescriptionComponent = destination.find((el) => (el.id === destination)).pictures[0].description;
  //const createPhotosTemplate = () => photoComponent.map((picture) =>
  //`<img class="event__photo" src=${picture} alt='${photoDescriptionComponent}'>`);

  return `
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${typeComponent}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${getRandomArrayElement(OFFERS_TYPE)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
      <datalist id="destination-list-1">
        <option value="Amsterdam"></option>
        <option value="Geneva"></option>
        <option value="Chamonix"></option>
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        ${basePrice}&euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
          ${createOffersTemplate(OFFERS_OPTIONS)}
      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">  ${getRandomArrayElement(
    DESTINATIONS_DESCRIPTIONS
  )}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
         $ {createPhotosTemplate().join('')}

        </div>
      </div>
    </section>
  </section>
</form>
`;
};
export default class EditPointView {
  constructor(tripPoint) {
    this.tripPoint = tripPoint;
  }

  getTemplate() {
    return createEditPointTemplate(this.tripPoint);
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
