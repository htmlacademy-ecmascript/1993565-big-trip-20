import { createElement } from '../render.js';
import dayjs from 'dayjs';
import {
  humanizeDueDate,
  generateDate,
  getRandomArrayElement,
  getRandomInteger,
  humanizeHour,
  duration,
} from '../utils.js';
import { OFFERS_OPTIONS, OFFERS_TYPE, DESTINATIONS_NAME } from '../const.js';

const createPointTripTemplate = (pointTrip) => {
  const { basePrice, dateFrom, dateTo, offers, isFavorite } = pointTrip;
  const now = new Date().toLocaleTimeString().slice(0, -3);

  //const durationTime = duration(pointTrip.dateFrom, tripPoint.dateTo);
  //const favoriteClassName = isFavorite
  // ? 'event__favorite-btn--active'
  //: 'event__favorite-btn';

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18"> ${generateDate()}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/drive.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${getRandomArrayElement(
    OFFERS_TYPE
  )} ${getRandomArrayElement(DESTINATIONS_NAME)}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T14:30">${humanizeHour(
    15
  )}</time>
                    —
                    <time class="event__end-time" datetime="2019-03-18T16:05">${humanizeHour(
    15
  )}</time>
                  </p>
                  <p class="event__duration"> ${duration(14, 17)}</p>
                </div>
                <p class="event__price">
                  €&nbsp;<span class="event__price-value"> ${getRandomInteger(
    35,
    350
  )}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  <li class="event__offer">
                    ${getRandomArrayElement(
    OFFERS_OPTIONS
  )} +€ ${getRandomInteger(35, 90)}
                  </li>
                </ul>
                <button class="event__favorite-btn  " type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

export default class PointTripView {
  constructor(pointTrip) {
    this.pointTrip = pointTrip;
  }

  getTemplate() {
    return createPointTripTemplate(this.pointTrip);
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
