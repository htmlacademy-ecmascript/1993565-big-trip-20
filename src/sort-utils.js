import dayjs from 'dayjs';

const sortByPrice = (p1, p2) => {
  return p2.basePrice - p1.basePrice;
}

const sortByDay = (d1, d2) => {
  if (dayjs(d1.dateFrom).isSame(dayjs(d2.dateFrom))) {
    return 0;
  } else if (dayjs(d1.dateFrom).isAfter(dayjs(d2.dateFrom))) {
    return 1;
  } else {
    return -1;
  }
}

const sortByDuration = (dur1, dur2) => {
  const duration1 = dayjs(dur1.dateTo).diff(dayjs(dur1.dateFrom), 'm');
  const duration2 = dayjs(dur2.dateTo).diff(dayjs(dur2.dateFrom), 'm');
  return duration2 - duration1;
}

export { sortByPrice, sortByDay, sortByDuration };
