import {generateDestination} from '../mock/destination-mock.js';

export default class DestinationsModel {
  #destinationsTrip = Array.from({length: 3}, generateDestination);

  get destinations() {
    return this.#destinationsTrip;
  }
}
