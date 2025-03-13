import Cookies from 'js-cookie';

/**
 * Helper functions for managing cookies
 */

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options
 */
export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, value, options);
};

/**
 * Get a cookie by name
 * @param {string} name - Cookie name
 * @returns {string|undefined} - Cookie value or undefined if not found
 */
export const getCookie = (name) => {
  return Cookies.get(name);
};

/**
 * Remove a cookie by name
 * @param {string} name - Cookie name
 * @param {Object} options - Cookie options
 */
export const removeCookie = (name, options = {}) => {
  Cookies.remove(name, options);
};

/**
 * Check if a cookie exists
 * @param {string} name - Cookie name
 * @returns {boolean} - True if the cookie exists
 */
export const cookieExists = (name) => {
  return !!Cookies.get(name);
};

export default {
  setCookie,
  getCookie,
  removeCookie,
  cookieExists
}; 