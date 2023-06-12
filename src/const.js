const WAYPOINT_COUNT = 5;

const OFFERS_TYPE = [
  'Taxi',
  'Bus',
  'train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const OFFERS_OPTIONS = [
  'Order Uber',
  'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city',
];

const DESTINATIONS_NAME = [
  'Chamonix',
  'Marokko',
  'Amsterdam',
  'Prague',
  'Athens',
  'Tokyo',
  'Lisbon',
  'London',
  'Sydney',
  'Milan',
];

const DESTINATIONS_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
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
};
const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};


export {
  WAYPOINT_COUNT,
  OFFERS_TYPE,
  OFFERS_OPTIONS,
  DESTINATIONS_NAME,
  DESTINATIONS_DESCRIPTIONS,
  SORT_TYPE,
  USERACTION,
  UPDATETYPE,
  FILTER_TYPE,

};
