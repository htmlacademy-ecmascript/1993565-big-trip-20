import Observable from '../framework/observable';
export default class OffersModel extends Observable {
  #offersApiService;
  #offers = [];

  constructor({ offersApiService }) {
    super();
    this.#offersApiService = offersApiService;
  }

  async init() {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch (err) {
      this.#offers = [];
    }
  }

  get offers() {
    return this.#offers;
  }
}
