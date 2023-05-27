import NewEventButtonView from './view/new-event-button-view.js';
import FiltersView from './view/trip-filters-view.js';
import {render} from './framework/render.js';
import BoardPresenter from './presenter/event-presenter.js';
import DestinationsModel from './model/destination-model.js';

const tripEventsElement = document.querySelector('.trip-events');
const pageHeader = document.querySelector('.page-header');

const siteHeaderElement = document.querySelector('.trip-main');

//const filtersElement = pageHeader.querySelector('.trip-controls__filters');

const destinationsModel = new DestinationsModel();
const boardPresenter = new BoardPresenter({
  container: tripEventsElement,
  destinationsModel,
});

render(new NewEventButtonView(), siteHeaderElement);
render(new FiltersView(), siteHeaderElement);

boardPresenter.init();
