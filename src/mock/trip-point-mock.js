import { getRandomInteger,getRandomArrayElement } from '../utils.js';
import { OFFERS_TYPE, DESTINATIONS_NAME } from '../const.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

export const generatePoint = () => ({
  basePrice: getRandomInteger(100, 900),
  offers: [1, 2, 3],
  dateFrom: dayjs('2023-09-07T10:28:01.397Z'). format('DD/MM/YY HH:mm') ,
  dateTo: dayjs('2023-09-07T13:19:08.397Z'). format('DD/MM/YY HH:mm') ,
  destination: getRandomArrayElement(DESTINATIONS_NAME),
  id: nanoid(),
  isFavorite: false,
  type: OFFERS_TYPE[getRandomInteger(0, OFFERS_TYPE.length - 1)],
});
