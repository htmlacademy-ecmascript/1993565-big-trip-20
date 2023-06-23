import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const EmptyTripFilterType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createEmptyListTemplate = (filterType) => {
  const text = EmptyTripFilterType[filterType];
  return `<p class="trip-events__msg">
      ${text}
    </p>`;
}

export default class NewEmptyListView extends AbstractView {
  #filterType;
  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
