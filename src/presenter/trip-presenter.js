import {render, replace, remove} from '../framework/render.js';
import PointTripView from '../view/point-trip-view.js';
import EditPointView from '../view/edit-point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};


export default class TripPresenter {
  #tripEventsContainer = null;
  #handleFavoriteChange;
  #tripPoint = null;
  #tripPointComponent = null;
  #tripPointsContainer = null;
  #tripPointEditComponent = null;
  #handleDataChange = null;

  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #destinationArr = [];

  constructor({tripPointsContainer,onDataChange, onModeChange }) {
    this.#tripPointsContainer = tripPointsContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;

  }

  init(tripPoint, destinationArr) {
    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointEditComponent = this.#tripPointEditComponent;

    this.#destinationArr = destinationArr;
    this.#tripPoint = tripPoint;
    this.#tripPointComponent = new PointTripView({
      tripPoint,
      destinationArr: this.#destinationArr,
      onRollupClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },

      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#tripPointEditComponent = new EditPointView({
      tripPoint,
      destinationArr,
      onRollupClick: this.#handleRollupClick(),
      onFormSubmit: this.#handleFormSubmit()
    });

    if (prevTripPointComponent === null || prevTripPointEditComponent === null) {
      render(this.#tripPointComponent, this.#tripPointsContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#tripPointsContainer.contains(prevTripPointEditComponent.element)) {
      replace(this.#tripPointEditComponent, prevTripPointEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#tripPoint, isFavorite: !this.#tripPoint.isFavorite});
  };

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  }

  #handleFormSubmit(tripPoint) {
    return () => {
      this.#handleDataChange(tripPoint);

      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    };
  }

  #handleRollupClick() {
    return () => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    };
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };


  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();

    }
  }

  #replaceFormToPoint() {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    this.#mode = Mode.DEFAULT;

  }

  #replacePointToForm() {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }


}


