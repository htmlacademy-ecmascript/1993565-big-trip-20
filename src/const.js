const OFFERS_TYPE = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];


const SORT_TYPE = {
  DAY: 'day',
  TIME_LONG: 'time-long',
  PRICE_UP: 'price-up',
};

const USERACTION = {
  UPDATE_TRIP: 'UPDATE_TRIP',
  ADD_TRIP: 'ADD_TRIP',
  DELETE_TRIP: 'DELETE_TRIP',
};

const UPDATETYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export {
  OFFERS_TYPE,
  SORT_TYPE,
  USERACTION,
  UPDATETYPE,
  FILTER_TYPE,
};
