import Observable from '../framework/observable';

export default class DestinationsModel extends Observable {
  #destinationsApiService;
  #destinations = [];

  constructor({ destinationsApiService }) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  async init() {
    try {

      this.#destinations = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }

  get destinations() {
    return this.#destinations;
  }
}
