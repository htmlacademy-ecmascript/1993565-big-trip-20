import {generatePoint} from '../mock/trip-point-mock.js';

export default class DestinationsModel {
  #destinations = Array.from({length: 7}, generatePoint);

  get destinations() {
    return this.#destinations;
  }
}
