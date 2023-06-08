import {generatePoint} from '../mock/trip-point-mock.js';
import {getRandomArrayElement} from '../utils.js';

export default class TripPointsModel {

  #destinations = [];

  constructor(passedDestinations) {


    this.#destinations = Array(7).fill(true).map(() => generatePoint(getRandomArrayElement(passedDestinations).name));

  }


  get destinations() {
    return this.#destinations;
  }
}
