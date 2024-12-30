import { config } from './config.js';

process.env.TZ = 'Europe/Istanbul';

export const getDateTime = (timeZone = config.utcTimeZone) =>
  new Date()
    .toLocaleDateString('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone,
    })
    .replace(',', '');

export const getDate = (timeZone = config.utcTimeZone) =>
  new Date()
    .toLocaleDateString('en-GB', {
      timeZone,
    })
    .replace(',', '');

/**
 * timeZone : UTC, timeStamp
 */
export const getDateTimeStamp = (timeZone = config.utcTimeZone) => {
  if (timeZone === 'UTC') return new Date().toISOString().split('.')[0];
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return (
    year +
    '-' +
    (month + 1 < 10 ? '0' + (month + 1) : month + 1) +
    '-' +
    day +
    'T' +
    (hours < 10 ? '0' + hours : hours) +
    ':' +
    (minutes < 10 ? '0' + minutes : minutes) +
    ':' +
    (seconds < 10 ? '0' + seconds : seconds)
  );
};
