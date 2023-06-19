import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class TripsApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' }).then(ApiService.parseResponse);
  }

  async updateTrip(trip) {
    const response = await this._load({
      url: `points/${trip.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(trip)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return await ApiService.parseResponse(response);
  }

  async addTrip(trip) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(trip)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deleteTrip(trip) {
    const response = await this._load({
      url: `points/${trip.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(trip) {
    const adaptedTrip = {
      ...trip,
      base_price: parseInt(trip.basePrice, 10),
      date_from:
        trip.dateFrom instanceof Date ? trip.dateFrom.toISOString() : null, // На сервере дата хранится в ISO формате
      date_to: trip.dateTo instanceof Date ? trip.dateTo.toISOString() : null, // На сервере дата хранится в ISO формате
      is_favorite: trip.isFavorite,
    };

    delete adaptedTrip.dateFrom;
    delete adaptedTrip.dateTo;
    delete adaptedTrip.isFavorite;
    delete adaptedTrip.basePrice;
    delete adaptedTrip.isDisabled;
    delete adaptedTrip.isSaving;
    delete adaptedTrip.isDeleting;

    return adaptedTrip;
  }
}
