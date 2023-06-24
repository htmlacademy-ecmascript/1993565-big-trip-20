import NewEventButtonView from './view/new-event-button-view.js';
import { render } from './framework/render.js';
import BoardPresenter from './presenter/event-presenter.js';
import TripPointsModel from './model/trip-models.js';
import DestinationsModel from './model/destination-models.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import OffersModel from './model/offers-model.js';
import TripsApiService from './api/trips-api-service.js';
import DestinationsApiService from './api/destinations-api-service.js';
import OffersApiService from './api/offers-api-service.js';
import TripInfoView from './view/trip-inf-view.js';

const AUTHORIZATION = 'Basic hS3sfS44wcl0sa9j';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const pageHeaderElement = document.querySelector('.page-header');
const tripEventsElement = document.querySelector('.trip-events');
const siteHeaderElement = pageHeaderElement.querySelector('.trip-main');

async function main() {

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
    filterContainer: siteHeaderElement,
    filterModel,
    tripsModel,
  });


  render(new TripInfoView(), siteHeaderElement);
  filterPresenter.init();
  render(newTripButtonComponent, siteHeaderElement);
}

main();
