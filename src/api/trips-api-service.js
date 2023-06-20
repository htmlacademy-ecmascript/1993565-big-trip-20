import ApiService from '../framework/api-service.js';

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
      ...trip, // eslint-disable-next-line camelcase
      base_price: parseInt(trip.basePrice, 10), // eslint-disable-next-line camelcase
      date_from: // eslint-disable-next-line camelcase
        trip.dateFrom instanceof Date ? trip.dateFrom.toISOString() : null, // eslint-disable-next-line camelcase
      date_to: trip.dateTo instanceof Date ? trip.dateTo.toISOString() : null, // eslint-disable-next-line camelcase
      is_favorite: trip.isFavorite, // eslint-disable-next-line camelcase
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
