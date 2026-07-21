/**
 * Utils Module
 * Provides simple reusable helper functions for ID generation, 
 * date formatting, and basic validation.
 */

/**
 * Generates a new ID by increasing the provided counter by one.
 * 
 * @param {number} counter - The current counter value.
 * @returns {number} The new integer ID.
 */
export function generateId(counter) {
  // Ensure the counter is treated as an integer before incrementing
  return Math.floor(Number(counter)) + 1;
}

/**
 * Formats a date value into the standard application format (YYYY-MM-DD).
 * 
 * @param {Date|string|number} date - The date value to format.
 * @returns {string} The formatted date string.
 */
export function formatDate(date) {
  const d = new Date(date);
  
  // Return empty string if the provided date is invalid
  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Validates if a value exists (checks for null, undefined, or empty strings).
 * 
 * @param {*} value - The value to validate.
 * @returns {boolean} True if the value exists and is not empty, false otherwise.
 */
export function validateRequired(value) {
  // Check for null or undefined
  if (value === null || value === undefined) {
    return false;
  }
  
  // Check for empty or whitespace-only strings
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }

  return true;
}
