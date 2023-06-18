import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { OFFERS_TYPE} from '../const.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import he from 'he';

const BLANK_POINT = {
  basePrice: 0,
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  dateFrom: '',
  dateTo: '',
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

const createEditPointTemplate = (
  tripPoint,
  destinationArr,
  typeToOffersMap
) => {
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

  const createDestinationsTemplate = (destinationArr) => {
    let result = '';
    for (const destination of destinationArr.values()) {
      result += `
        <option value="${destination.name}"> </option>
        `;
    }
    return result;
  };

  const createOfferTemplate = (offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;

  const createOffers = (offers) => {
    let result = '';
    for (const offer of offers) {
      result += createOfferTemplate(offer);
    }

    return result;
  };

  function createOffersTemplate(offers) {
    if (!offers || offers.length === 0) {
      return '';
    }

    let result = `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">`;

    for (const offer of offers) {
      result += createOfferTemplate(offer);
    }

    result += '</div></section>';
    return result;
  }

  function createPhotosTemplate(photos) {
    let result = '';
    if (!photos) {
      return result;
    }

    for (const photo of photos) {
      result += `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
    }

    return result;
  }

  function createDestinationTemplate(destin) {
    if (!destin) {
      return '';
    }

    const photosTemplate = createPhotosTemplate(destin.pictures);

    return `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destin.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
            ${photosTemplate}
        </div>
      </div>
    </section>`;
  }

  const destination = destinationArr.get(tripPoint.destination);
  const offersTemplate = createOffers(
    typeToOffersMap.get(tripPoint.type)
  );
  const destinationTemplate = createDestinationTemplate(destination);
  const typeComponent = createType();
  const destinationsTemplate = createDestinationsTemplate(destinationArr);

  return `
  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${tripPoint.type}.png" alt="Event type icon">
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

       <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
        ${destinationsTemplate}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${tripPoint.dateFrom} ">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${tripPoint.dateTo} ">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${tripPoint.basePrice}">
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
          ${offersTemplate}
           </div>
                  </section>
          ${destinationTemplate}

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
  #typeToOffersMap;

  constructor({
    tripPoint = BLANK_POINT,
    destinationArr,
    typeToOffersMap,
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
    this.#typeToOffersMap = typeToOffersMap;
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(
      this._state,
      this.#destinationArr,
      this.#typeToOffersMap
    );
  }

  static parseTripToState(tripPoint) {
    return {
      ...tripPoint,
      type: tripPoint.type,
      destination: tripPoint.destination,
    };
  }

  #rollupClickHandler = () => {
    this.#handleRollupClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
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

  static parseStateToTrip = (state) => ({ ...state });
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

    this.element
      .querySelector('input[name=event-price]')
      .addEventListener('change', this.#formPriceHandler);

    const destination = this.element.querySelector(
      'input[name=event-destination]'
    );

    destination.addEventListener('change', () => {
      for (const destinat of this.#destinationArr) {
        if (destinat.name === destination.value) {
          this.updateElement({ destination: destinat });
        }
      }
    });

    this.#setStartDatepicker();
    this.#setEndDatepicker();
  }
}
