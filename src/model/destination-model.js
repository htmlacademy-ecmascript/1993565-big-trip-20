import {generateDestination} from '../mock/destination-mock.js';

export default class DestinationsModel {
  destinations = Array.from({length: 3}, generateDestination);

  getDestinations = () => this.destinations;
}
