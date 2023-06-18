import { remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import { nanoid } from 'nanoid';
import { USERACTION, UPDATETYPE } from '../const.js';

export default class NewTripPresenter {
  #tripListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #destinationArr;
  #tripEditComponent = null;

  constructor({ tripListContainer, onDataChange, onDestroy, destinationArr }) {
    this.#tripListContainer = tripListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinationArr = destinationArr;
  }

  init() {
    if (this.#tripEditComponent !== null) {
      return;
    }

    this.#tripEditComponent = new EditPointView({
      onFormSubmit: this.#handleFormSubmit,

      onDeleteClick: this.#handleDeleteClick,
      destinationArr: this.#destinationArr,
    });

    render(
      this.#tripEditComponent,
      this.#tripListContainer, RenderPosition.AFTERBEGIN
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

  #handleFormSubmit = (trip) => {

    this.#handleDataChange(
      USERACTION.ADD_TRIP,
      UPDATETYPE.MINOR,
      { id: nanoid(), ...trip }
    );
    this.destroy();
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
