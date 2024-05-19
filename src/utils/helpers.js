import { formatDistance, parseISO, differenceInDays } from 'date-fns';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = dateStr =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('in', 'In');

/**
 * Returns the current date as an ISO string, with the time set to the start or end of the day depending on the options object.
 *
 * @param {object} options - An optional object that can contain the property "end". If "end" is true, the time will be set to the end of the day.
 * @return {string} The current date as an ISO string.
 */
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

/**
 * Formats a given value as a currency string.
 *
 * @param {number} value - The value to be formatted as currency.
 * @param {string} [currency='INR'] - The currency code to be used for formatting. Defaults to 'INR'.
 * @param {string} [numberFormat='en-IN'] - The locale string to be used for number formatting. Defaults to 'en-IN'.
 * @return {string} The formatted currency string.
 */
export const formatCurrency = function (
  value,
  currency = 'INR',
  numberFormat = 'en-IN'
) {
  return new Intl.NumberFormat(numberFormat, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Sets the local hours of a given date to the UTC offset.
 *
 * @param {Date} date - The date to set the local hours to the UTC offset.
 * @return {Date|undefined} - The updated date with the local hours set to the UTC offset, or undefined if the input date is falsy.
 */
export function setLocalHoursToUTCOffset(date) {
  const offset = new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  date?.setHours(hours, minutes);
  return date;
}
