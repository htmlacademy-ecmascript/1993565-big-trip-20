import { remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import { USERACTION, UPDATETYPE } from '../const.js';

export default class NewTripPresenter {
  #tripListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #typeToOffersMap;

  #destinationArr;
  #tripEditComponent = null;

  constructor({ tripListContainer, onDataChange, onDestroy, destinationArr, typeToOffersMap }) {
    this.#tripListContainer = tripListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinationArr = destinationArr;
    this.#typeToOffersMap = typeToOffersMap;
  }

  init() {
    if (this.#tripEditComponent !== null) {
      return;
    }

    this.#tripEditComponent = new EditPointView({
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onRollupClick: this.#handleRollupClick,
      destinationArr: this.#destinationArr,
      typeToOffersMap: this.#typeToOffersMap,
    });

    render(
      this.#tripEditComponent,
      this.#tripListContainer,
      RenderPosition.AFTERBEGIN
    );

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#tripEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#tripEditComponent);
    this.#tripEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleRollupClick = () => {
    this.destroy();
  };

  setSaving() {
    this.#tripEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#tripEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#tripEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (trip) => {
    this.#handleDataChange(USERACTION.ADD_TRIP, UPDATETYPE.MINOR, trip);
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
