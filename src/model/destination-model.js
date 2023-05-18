import {generatePoint} from '../mock/trip-point-mock.js';

export default class DestinationsModel {
  destinations = Array.from({length: 3}, generatePoint);

  getDestinations() {
    return this.destinations;
  }
}
