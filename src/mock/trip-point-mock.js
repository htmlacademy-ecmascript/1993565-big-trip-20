import { getRandomInteger } from '../utils.js';
import { OFFERS_TYPE } from '../const.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

export const generatePoint = () => ({
  basePrice: getRandomInteger(100, 900),
  dateFrom: dayjs('2019-01-25'). format('DD/MM/YY HH:mm') ,
  dateTo: dayjs('2019-01-26'). format('DD/MM/YY HH:mm') ,
  destination: getRandomInteger(1, 3),
  id: nanoid(),
  isFavorite: false,
  offers: [1, 2, 3],
  type: OFFERS_TYPE[getRandomInteger(0, OFFERS_TYPE.length - 1)],
});
