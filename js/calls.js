import * as Storage from './storage.js';
import * as UI from './ui.js';
import * as Events from './events.js';

// ---------------------------------------------------------------------------
// Internal State
// ---------------------------------------------------------------------------

let activeCall = null;

// ---------------------------------------------------------------------------
// Public Functions
// ---------------------------------------------------------------------------

/**
 * Start a new call for the given contact.
 *
 * @param {string} contactId - The ID of the contact being called.
 * @returns {object} The active call state.
 */
export function startCall(contactId) {
  activeCall = {
    contactId,
    startTime: Date.now(),
    status: 'active',
  };

  Events.emit('call:started', activeCall);
  render();

  return activeCall;
}

/**
 * End the current active call and persist its record.
 *
 * @param {string} result - The outcome of the call (e.g. "answered", "missed").
 * @returns {object} The created call record.
 */
export function endCall(result) {
  if (!activeCall) {
    return null;
  }

  const endTime = Date.now();
  const duration = endTime - activeCall.startTime;

  const callRecord = {
    contactId: activeCall.contactId,
    startTime: activeCall.startTime,
    endTime,
    duration,
    result,
    status: 'completed',
  };

  Storage.saveCall(callRecord);

  activeCall = null;

  Events.emit('call:completed', callRecord);
  render();

  return callRecord;
}

/**
 * Retrieve the call history for a specific contact.
 *
 * @param {string} contactId - The ID of the contact.
 * @returns {Array} List of call records matching the contact.
 */
export function getCallHistory(contactId) {
  const calls = Storage.getCalls();

  return calls.filter((call) => call.contactId === contactId);
}

/**
 * Build and display the current call panel.
 *
 * @param {object} [callData] - Optional call data override; defaults to activeCall.
 */
export function render(callData) {
  const data = callData ?? activeCall;
  const panel = document.createElement('div');
  panel.className = 'call-panel';

  if (!data) {
    panel.innerHTML = '<p class="call-panel__empty">No active call</p>';
    UI.render(panel, document.getElementById('panel-calls'));
    return;
  }

  const elapsed = data.status === 'active'
    ? formatDuration(Date.now() - data.startTime)
    : formatDuration(data.duration);

  panel.innerHTML = `
    <div class="call-panel__status">${data.status}</div>
    <div class="call-panel__contact" data-contact-id="${data.contactId}">
      Contact: ${data.contactId}
    </div>
    <div class="call-panel__duration">Duration: ${elapsed}</div>
  `;

  UI.render(panel, document.getElementById('panel-calls'));
}

// ---------------------------------------------------------------------------
// Private Helpers
// ---------------------------------------------------------------------------

/**
 * Format a duration in milliseconds to mm:ss.
 *
 * @param {number} ms - Duration in milliseconds.
 * @returns {string} Formatted duration string.
 */
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${minutes}:${seconds}`;
}
