import NewEventButtonView from './view/new-event-button-view.js';
import FiltersView from './view/trip-filters-view.js';
import { render } from './render.js';
import BoardPresenter from './presenter/event-presenter.js';
import DestinationsModel from './model/destination-model.js';

const siteMainElement = document.querySelector('.trip-events');

const siteHeaderElement = document.querySelector('.trip-main');

const destinationsModel = new DestinationsModel();
const boardPresenter = new BoardPresenter({
  container: siteMainElement,
  destinationsModel,
});

render(new NewEventButtonView(), siteHeaderElement);
render(new FiltersView(), siteHeaderElement);

boardPresenter.init();
