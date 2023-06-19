import { UPDATETYPE } from '../const.js';
import Observable from '../framework/observable.js';

export default class TripPointsModel extends Observable {
  #tripsApiService = null;
  #trips = [];

  constructor({ tripsApiService }) {
    super();
    this.#tripsApiService = tripsApiService;

  }

  get destinations() {
    return this.#trips;
  }

  async init() {
    try {
      const trips = await this.#tripsApiService.points;
      this.#trips = trips.map(this.#adaptToClient);
    } catch (err) {
      this.#trips = [];
    }
    this._notify(UPDATETYPE.INIT);
  }

  async updateTrip(updateType, update) {
    const index = this.#trips.findIndex((trip) => trip.id === update.id);

    if (index === -1) {
      throw new Error('Can,t update unexisting trip');
    }

    try {
      const response = await this.#tripsApiService.updateTrip(update);
      const updatedTrip = this.#adaptToClient(response);

      this.#trips = [
        ...this.#trips.slice(0, index),
        updatedTrip,
        ...this.#trips.slice(index + 1),
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can,t update trip');
    }
  }

  async addTrip(updateType, update) {
    try {
      const response = await this.#tripsApiService.addTrip(update);
      const newTrip = this.#adaptToClient(response);
      this.#trips = [newTrip, ...this.#trips];
      this._notify(updateType, newTrip);
    } catch (err) {
      throw new Error('Can,t add trip');
    }
  }

  async deleteTrip(updateType, update) {
    const index = this.#trips.findIndex((trip) => trip.id === update.id);

    if (index === -1) {
      throw new Error('Can,t delete unexisting trip');
    }

    try {
      await this.#tripsApiService.deleteTrip(update);
      this.#trips = [
        ...this.#trips.slice(0, index),
        ...this.#trips.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can,t delete trip');
    }
  }

  #adaptToClient(trip) {
    const adaptedTrip = {
      ...trip,
      basePrice: trip['base_price'],
      dateFrom:
        trip['date_from'] !== null
          ? new Date(trip['date_from'])
          : trip['date_from'], // На клиенте дата хранится как экземпляр Date
      dateTo:
        trip['date_to'] !== null ? new Date(trip['date_to']) : trip['date_to'],
      isFavorite: trip['is_favorite'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedTrip['base_price'];
    delete adaptedTrip['date_from'];
    delete adaptedTrip['date_to'];
    delete adaptedTrip['is_favorite'];

    return adaptedTrip;
  }
}
