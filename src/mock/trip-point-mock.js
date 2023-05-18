import { getRandomInteger } from '../utils.js';
import { OFFERS_TYPE } from '../const.js';

export const generatePoint = () => ({
  basePrice: getRandomInteger(100, 900),
  dateFrom: new Date().toISOString(),
  dateTo: new Date().toISOString(),
  destination: getRandomInteger(1, 3),
  id: getRandomInteger(1, 3),
  isFavorite: false,
  offers: [1, 2, 3],
  type: OFFERS_TYPE[getRandomInteger(0, OFFERS_TYPE.length - 1)],
});
