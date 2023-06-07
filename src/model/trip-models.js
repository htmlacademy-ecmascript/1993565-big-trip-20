import {generatePoint} from '../mock/trip-point-mock.js';

export default class TripPointsModel {
  #destinations = Array.from({length: 7}, generatePoint);

  get destinations() {
    return this.#destinations;
  }
}
