import dayjs from 'dayjs';
import { FILTER_TYPE } from './const.js';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
const getRandomDate = (minDaysGap, maxDaysGap) => {
  const daysGap = getRandomInteger(minDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const humanizeDueDate = (dueDate) =>
  dueDate ? dayjs(dueDate).format('MMM DD') : '';

const generatetDateTime = (date) => dayjs(date).format('YYYY-MM-DThh:mm');
const getRandomArrayElement = (elements) =>
  elements[getRandomInteger(0, elements.length - 1)];

function humanizeHour(hour) {
  return hour ? dayjs(hour).format('HH:MM') : '';
}

const isDatesEqual = (dateA, dateB) =>
  (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const duration = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));


function isInThePast(date) {
  return date && dayjs().isAfter(date, 'D');
}

function isCurrentDate(dateFrom, dateTo) {
  return dateFrom && dateTo && !isInThePast(dateTo) && !isInFuture(dateFrom);
}

function isInFuture(date) {
  return date && dayjs().isBefore(date, 'D');
}

const filter = {
  [FILTER_TYPE.EVERYTHING]: (tripPoints) => tripPoints,
  [FILTER_TYPE.PAST]: (tripPoints) =>
    tripPoints.filter((tripPoint) => isInThePast(tripPoint.dateTo)),
  [FILTER_TYPE.PRESENT]: (tripPoints) =>
    tripPoints.filter((tripPoint) =>
      isCurrentDate(tripPoint.dateFrom, tripPoint.dateTo)
    ),
  [FILTER_TYPE.FUTURE]: (tripPoints) =>
    tripPoints.filter((tripPoint) => isInFuture(tripPoint.dateFrom)),
};

const humanizeDate = (date) => dayjs(date).format('DD MMM');
export {
  getRandomInteger,
  getRandomDate,
  generatetDateTime,
  getRandomArrayElement,
  humanizeHour,
  humanizeDate,
  humanizeDueDate,
  duration,
  isDatesEqual,
  filter,
};
