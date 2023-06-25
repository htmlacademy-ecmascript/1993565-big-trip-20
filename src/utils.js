import dayjs from 'dayjs';
import { FilterType } from './const.js';

const humanizeDueDate = (dueDate) => dueDate ? dayjs(dueDate).format('MMM DD') : '';

const humanizeHour = (hour) => hour ? dayjs(hour).format('HH:MM') : '';

const humanizeDateTime = (dateTime) => dateTime ? dayjs(dateTime).format('DD/MM/YY HH:mm') : '';

const durationCalculation = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));

const checkIsInThePast = (date) => date && dayjs().isAfter(date, 'D');

const checkIsInFuture = (date) => date && dayjs().isBefore(date, 'D');

const checkIsCurrentDate = (dateFrom, dateTo) => dateFrom && dateTo && !checkIsInThePast(dateTo) && !checkIsInFuture(dateFrom);

const FILTER = {
  [FilterType.EVERYTHING]: (tripPoints) => tripPoints,
  [FilterType.PAST]: (tripPoints) =>
    tripPoints.filter((tripPoint) => checkIsInThePast(tripPoint.dateTo)),
  [FilterType.PRESENT]: (tripPoints) =>
    tripPoints.filter((tripPoint) =>
      checkIsCurrentDate(tripPoint.dateFrom, tripPoint.dateTo)
    ),
  [FilterType.FUTURE]: (tripPoints) =>
    tripPoints.filter((tripPoint) => checkIsInFuture(tripPoint.dateFrom)),
};

export {
  humanizeHour,
  humanizeDateTime,
  humanizeDueDate,
  durationCalculation,
  FILTER,
};
