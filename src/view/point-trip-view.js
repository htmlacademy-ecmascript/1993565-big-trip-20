import AbstractView from '../framework/view/abstract-view.js';
import {
  //humanizeDueDate,
  generateDate,
  getRandomArrayElement,
  getRandomInteger,
  humanizeHour,
  duration,
} from '../utils.js';
import { OFFERS_OPTIONS } from '../const.js';


const createPointTripTemplate = (tripPoint) => {
  const { basePrice, dateFrom, dateTo, offers, isFavorite } = tripPoint;
  const startTime = humanizeHour(tripPoint.dateFrom);
  const endTime = humanizeHour(tripPoint.dateTo);
  const durationTime = duration(tripPoint.dateFrom, tripPoint.dateTo);
  const favoriteClassName = tripPoint.isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18"> ${generateDate()}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${tripPoint.type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${tripPoint.type} ${tripPoint.destination}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${tripPoint.dateFrom}">${startTime}</time>
                    —
                    <time class="event__end-time" datetime="${tripPoint.dateTo}">${endTime}</time>
                  </p>
                  <p class="event__duration"> ${durationTime}</p>
                </div>
                <p class="event__price">
                  €&nbsp;<span class="event__price-value"> ${tripPoint.basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  <li class="event__offer">
                    ${getRandomArrayElement(OFFERS_OPTIONS)} +€ ${getRandomInteger(35, 90)}
                  </li>
                </ul>
                <button class="event__favorite-btn  ${favoriteClassName}" type="button">
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
export default class PointTripView extends AbstractView {
  #tripPoint = null;
  #handleRollupClick = null;
  #handleFavoriteClick = null;

  constructor({tripPoint, onRollupClick, onFavoriteClick}) {
    super();
    this.#tripPoint = tripPoint;
    this.#handleRollupClick = onRollupClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editCLickHandler);


    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);


  }


  get template() {

    return createPointTripTemplate(this.#tripPoint);
  }

  #editCLickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };


}
