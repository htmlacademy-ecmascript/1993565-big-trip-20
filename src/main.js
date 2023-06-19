import NewEventButtonView from './view/new-event-button-view.js';
import { render } from './framework/render.js';
import BoardPresenter from './presenter/event-presenter.js';
import TripPointsModel from './model/trip-models.js';
import DestinationsModel from './model/destination-models.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import OffersModel from './model/offers-model.js';
import TripsApiService from './trips-api-service.js';
import DestinationsApiService from './destinations-api-service.js';
import OffersApiService from './offers-api-service.js';

async function main() {
  const tripEventsElement = document.querySelector('.trip-events');

  const siteHeaderElement = document.querySelector('.trip-main');

  const siteFilterElement = document.querySelector('.trip-controls');

  const AUTHORIZATION = 'Basic hS3sfS44wcl0sa9j';
  const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

  const filterModel = new FilterModel();

  const tripsModel = new TripPointsModel({
    tripsApiService: new TripsApiService(END_POINT, AUTHORIZATION),
  });

  const destinationModels = new DestinationsModel({
    destinationsApiService: new DestinationsApiService(
      END_POINT,
      AUTHORIZATION
    ),
  });

  const offersModel = new OffersModel({
    offersApiService: new OffersApiService(END_POINT, AUTHORIZATION),
  });
  await offersModel.init();

  await destinationModels.init();

  const boardPresenter = new BoardPresenter({
    container: tripEventsElement,
    tripsModel,
    destinationModels,
    filterModel,
    offersModel,
    onNewTripDestroy: handleNewTripFormClose,
  });
  await tripsModel.init();
  const newTripButtonComponent = new NewEventButtonView({
    onClick: handleNewTripButtonClick,
  });

  function handleNewTripFormClose() {
    newTripButtonComponent.enabled();
  }
  function handleNewTripButtonClick() {
    boardPresenter.createTrip();
    newTripButtonComponent.disabled();
  }

  const filterPresenter = new FilterPresenter({
    filterContainer: siteFilterElement,
    filterModel,
    tripsModel,
  });

  filterPresenter.init();
  //boardPresenter.init();

  render(newTripButtonComponent, siteHeaderElement);
}
main();
