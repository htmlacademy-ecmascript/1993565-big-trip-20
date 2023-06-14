import NewEventButtonView from './view/new-event-button-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/event-presenter.js';
import TripPointsModel from './model/trip-models.js';
import DestinationsModel from './model/destination-models.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';


const tripEventsElement = document.querySelector('.trip-events');

const siteHeaderElement = document.querySelector('.trip-main');

const siteFilterElement = document.querySelector('.trip-controls');


const destinationModels = new DestinationsModel();
const filterModel = new FilterModel();

const tripsModel = new TripPointsModel(destinationModels.destinations);

const boardPresenter = new BoardPresenter({
  container: tripEventsElement,
  tripsModel,
  destinationModels,
  filterModel,
  onNewTripDestroy: handleNewTripFormClose
});

const newTripButtonComponent = new NewEventButtonView({
  onClick: handleNewTripButtonClick
});

function handleNewTripFormClose() {
  newTripButtonComponent.enabled;
}
function handleNewTripButtonClick() {
  boardPresenter.createTrip();
  newTripButtonComponent.disabled;
}

const filterPresenter = new FilterPresenter({
  filterContainer: siteFilterElement,
  filterModel,
  tripsModel
});

render(newTripButtonComponent, siteHeaderElement);

filterPresenter.init();
boardPresenter.init();
