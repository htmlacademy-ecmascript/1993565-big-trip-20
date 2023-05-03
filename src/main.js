import NewEventButtonView from './view/new-event-button-view.js';
import FiltersView from './view/trip-filters-view.js';
import { render } from './render.js';
import BoardPresenter from './presenter/event-presenter.js';

const siteMainElement = document.querySelector('.page-body');


const siteHeaderElement = siteMainElement.querySelector('.trip-main');

const boardPresenter = new BoardPresenter({boardContainer: siteMainElement});

render(new NewEventButtonView(), siteHeaderElement);
render(new FiltersView(), siteHeaderElement);

boardPresenter.init();
