import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  OFFERS_OPTIONS,
  OFFERS_TYPE,
  DESTINATIONS_DESCRIPTIONS,
} from '../const.js';
import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import he from 'he';

const BLANK_POINT = {
  basePrice: 0,
  destination: '',
  dateFrom: '',
  dateTo: '',
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

const createEditPointTemplate = (tripPoint, destinationArr) => {
  const {
    basePrice, /*destination,*/
    dateFrom,
    dateTo,
    type /*offers*/,
  } = tripPoint;

  const createDestinationsTemplate = (destinationArr) => {
    let result = '';
    for (const destination of destinationArr) {
      result += `
        <option value="${destination.name}"> ${destination.name}</option>
        `;
    }
    return result;
  };

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

  const destinationsTemplate = createDestinationsTemplate(destinationArr);


  return `
  <li class="trip-events__item">
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
        ${tripPoint.type}
      </label>

       <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${
  he.encode(tripPoint.destination)
}" list="destination-list-1">
            <datalist id="destination-list-1">
        ${destinationsTemplate}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom} ">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo} ">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${
  tripPoint.basePrice
}">
    </div>

       <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
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


    </section>
  </section>
</form>
</li>
`;
};
export default class EditPointView extends AbstractStatefulView {
  #tripPoint = null;
  #handleRollupClick = null;
  #handleFormSubmit = null;
  #destinationArr;
  #dateStartPicker = null;
  #dateEndPicker = null;
  #handleDeleteClick = null;

  constructor({
    tripPoint = BLANK_POINT,
    destinationArr,
    onRollupClick,
    onFormSubmit,
    onDeleteClick,
  }) {
    super();
    this._setState(EditPointView.parseTripToState(tripPoint));
    this.#handleRollupClick = onRollupClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#destinationArr = destinationArr;
    this.#handleDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinationArr);
  }

  static parseTripToState(tripPoint) {
    return {
      ...tripPoint,
      type: tripPoint.type,
      destination: tripPoint.destination,
    };
  }

  #rollupClickHandler = (evt) => {
    this.#handleRollupClick();
  };

  #formSubmitHandler = (evt) => {
    this.#handleFormSubmit(EditPointView.parseTripToState(this._state));
  };

  #startTimeChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateEndChangeHandler = ([userDate]) => {

    this.updateElement({
      dateTo: userDate,
    });
  };

  #setStartDatepicker() {
    this.#dateStartPicker = flatpickr(
      this.element.querySelector('input[name=event-start-time]'),
      {
        dateFormat: 'j/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateStart,
        onChange: this.#startTimeChangeHandler, // На событие flatpickr передаём наш колбэк
      }
    );
  }

  #setEndDatepicker() {
    // flatpickr есть смысл инициализировать только в случае,
    // если поле выбора даты доступно для заполнения
    this.#dateEndPicker = flatpickr(
      this.element.querySelector('input[name=event-end-time]'),
      {
        dateFormat: 'j/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateEnd,
        onChange: this.#dateEndChangeHandler, // На событие flatpickr передаём наш колбэк
      }
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#dateStartPicker) {
      this.#dateStartPicker.destroy();
      this.#dateStartPicker = null;
    }
    if (this.#dateEndPicker) {
      this.#dateEndPicker.destroy();
      this.#dateEndPicker = null;
    }
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToTrip(this._state));
  };

  #formPriceHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };


  static parseStateToTrip = (state) => ({...state});
  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    const tripTypes = this.element.querySelectorAll('input[name=event-type]');
    for (const tripType of tripTypes) {
      tripType.addEventListener('change', () => {
        this.updateElement({ type: tripType.value });
      });
    }

    this.element.querySelector('input[name=event-price]')
      .addEventListener('change', this.#formPriceHandler);

    const destination = this.element.querySelector(
      'input[name=event-destination]'
    );

    destination.addEventListener('change', () => {
      for (const destinat of this.#destinationArr) {
        if (destinat.name === destination.value) {
          this.updateElement({ destination: destinat.name });
        }
      }
    });
    this.#setStartDatepicker();
    this.#setEndDatepicker();
  }
}
