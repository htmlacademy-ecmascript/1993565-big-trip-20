import AbstractView from '../framework/view/abstract-view.js';
import {FILTER_TYPE} from '../const.js';

const EmptyTripFilterType = {
  [FILTER_TYPE.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPE.PAST]: 'There are no past events now',
  [FILTER_TYPE.PRESENT]: 'There are no present events now',
  [FILTER_TYPE.FUTURE]: 'There are no future events now',
};

function createEmptyListTemplate(filterType) {
  const text = EmptyTripFilterType[filterType];
  return (
    `<p class="trip-events__msg">
      ${text}
    </p>`
  );
}


export default class NewEmptyListView extends AbstractView {
  #filterType;
  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {

    return createEmptyListTemplate(this.#filterType);
  }


}
