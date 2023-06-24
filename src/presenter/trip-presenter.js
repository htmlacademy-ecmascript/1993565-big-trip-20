/* eslint-disable no-unused-expressions */
import { render, replace, remove } from '../framework/render.js';
import PointTripView from '../view/point-trip-view.js';
import EditPointView from '../view/edit-point-view.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPresenter {
  #tripPoint = null;
  #tripPointComponent = null;
  #tripPointsContainer = null;
  #tripPointEditComponent = null;
  #handleDataChange;
  #typeToOffersMap;

  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #destinationArr = [];

  constructor({ tripPointsContainer, onDataChange, onModeChange }) {
    this.#tripPointsContainer = tripPointsContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(tripPoint, destinationArr, typeToOffersMap) {
    const prevTripPointComponent = this.#tripPointComponent;
    const prevTripPointEditComponent = this.#tripPointEditComponent;
    this.#destinationArr = destinationArr;
    this.#tripPoint = tripPoint;

    this.#typeToOffersMap = typeToOffersMap;
    this.#tripPointComponent = new PointTripView({
      tripPoint,
      destinationArr: this.#destinationArr,
      typeToOffersMap: this.#typeToOffersMap,
      onRollupClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },

      onFavoriteClick: () => {
        this.#handleDataChange(UserAction.UPDATE_TRIP,
          UpdateType.MINOR,
          {
            ...this.#tripPoint,
            isFavorite: !this.#tripPoint.isFavorite,
          });
      },
    });

    this.#tripPointEditComponent = new EditPointView({
      tripPoint,
      destinationArr,
      typeToOffersMap,
      onRollupClick: this.#handleRollupClick,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
    });

    if (
      prevTripPointComponent === null ||
      prevTripPointEditComponent === null
    ) {
      render(this.#tripPointComponent, this.#tripPointsContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevTripPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripPointComponent, prevTripPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    if (
      this.#tripPointsContainer.contains(prevTripPointEditComponent.element)
    ) {
      replace(this.#tripPointEditComponent, prevTripPointEditComponent);
    }

    remove(prevTripPointComponent);
    remove(prevTripPointEditComponent);
  }

  #handleFormSubmit = (tripUpdate) => {
    this.#handleDataChange(
      UserAction.UPDATE_TRIP,
      UpdateType.MINOR,
      tripUpdate
    );
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleDeleteClick = (trip) => {
    this.#handleDataChange(UserAction.DELETE_TRIP, UpdateType.MINOR, trip);
  };

  destroy() {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#tripPointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#tripPointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#tripPointEditComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#tripPointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#tripPointEditComponent.shake(resetFormState);
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
