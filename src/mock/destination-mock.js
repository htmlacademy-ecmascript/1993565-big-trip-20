import { getRandomArrayElement } from '../utils.js';
import { DESTINATIONS_NAME, DESTINATIONS_DESCRIPTIONS } from '../const.js';
// точка назначения, финиш

export const generateDestination = () => ({
  id: getRandomArrayElement(0, 3),
  description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
  name: getRandomArrayElement(DESTINATIONS_NAME),
  pictures: [
    {
      src: 'http://picsum.photos/300/200?r=0.0762563005163317',
      description: getRandomArrayElement(DESTINATIONS_DESCRIPTIONS),
    },
  ],
});
