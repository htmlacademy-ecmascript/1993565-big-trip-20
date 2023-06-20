import dayjs from 'dayjs';
import { FILTER_TYPE } from './const.js';

const humanizeDueDate = (dueDate) =>
  dueDate ? dayjs(dueDate).format('MMM DD') : '';

const humanizeHour = (hour) => (hour ? dayjs(hour).format('HH:MM') : '');

const isDatesEqual = (dateA, dateB) =>
  (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const duration = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));

const isInThePast = (date) => date && dayjs().isAfter(date, 'D');

const isCurrentDate = (dateFrom, dateTo) =>
  dateFrom && dateTo && !isInThePast(dateTo) && !isInFuture(dateFrom);

const isInFuture = (date) => date && dayjs().isBefore(date, 'D');

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
  humanizeHour,
  humanizeDate,
  humanizeDueDate,
  duration,
  isDatesEqual,
  filter,
};
