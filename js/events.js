/**
 * Events Module
 * Manages communication between modules through events.
 */

let events = {};

/**
 * Register an event listener.
 * @param {string} eventName - The name of the event.
 * @param {Function} callback - The callback function to execute when the event is triggered.
 */
export function on(eventName, callback) {
    if (!events[eventName]) {
        events[eventName] = [];
    }
    events[eventName].push(callback);
}

/**
 * Trigger an event and pass data to all registered listeners.
 * @param {string} eventName - The name of the event.
 * @param {*} data - The data to pass to the listeners.
 */
export function emit(eventName, data) {
    if (events[eventName]) {
        events[eventName].forEach(listener => {
            listener(data);
        });
    }
}

/**
 * Remove a specific event listener.
 * @param {string} eventName - The name of the event.
 * @param {Function} callback - The callback function to remove.
 */
export function off(eventName, callback) {
    if (events[eventName]) {
        events[eventName] = events[eventName].filter(listener => listener !== callback);
    }
}

/**
 * Remove all registered events and clear the events object.
 */
export function clear() {
    events = {};
}
