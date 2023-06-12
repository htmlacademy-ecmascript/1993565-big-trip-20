import {generatePoint} from '../mock/trip-point-mock.js';
import {getRandomArrayElement} from '../utils.js';

import Observable from '../framework/observable.js';

export default class TripPointsModel extends Observable {

  #destinations = [];

  constructor(passedDestinations) {
    super();
    this.#destinations = Array(7).fill(true).map(() => generatePoint(getRandomArrayElement(passedDestinations).name));
  }

  get destinations() {
    return this.#destinations;
  }

  updateTrip(updateType, update) {
    const index = this.#destinations.findIndex((destination) => destination.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#destinations = [
      ...this.#destinations.slice(0, index),
      update,
      ...this.#destinations.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addTrip(updateType, update) {
    this.#destinations = [
      update,
      ...this.#destinations,
    ];

    this._notify(updateType, update);
  }

  deleteTrip(updateType, update) {
    const index = this.#destinations.findIndex((destination) => destination.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#destinations = [
      ...this.#destinations.slice(0, index),
      ...this.#destinations.slice(index + 1),
    ];

    this._notify(updateType);
  }


}
