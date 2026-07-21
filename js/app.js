import * as Storage from './storage.js';
import * as Events from './svents.js';
import * as UI from './ui.js';

let applicationState = null;
let currentPanel = null;

/**
 * Loads the default application state.
 * @returns {Object} Default state object.
 */
function loadDefaultState() {
  return {
    defaultPanel: 'main',
    session: {}
  };
}

/**
 * Starts the application.
 * Initializes core modules, loads default state, and displays the initial panel.
 */
export function start() {
  // 1. Initialize workspace through Storage
  Storage.initialize();
  
  // 2. Initialize Events system
  Events.initialize();
  
  // 3. Initialize UI
  UI.initialize();
  
  // 4. Load default application state
  applicationState = loadDefaultState();
  
  // 5. Display initial panel
  changePanel(applicationState.defaultPanel);
}

/**
 * Changes the active panel in the application.
 * @param {string} panel - The name of the panel to display.
 */
export function changePanel(panel) {
  // 1 & 2. Receive requested panel and notify UI to render it
  UI.renderPanel(panel);
  
  // 3. Update current application panel state
  currentPanel = panel;
  applicationState.currentPanel = panel;
}

/**
 * Retrieves the current application state.
 * @returns {Object} The current application state.
 */
export function getApplicationState() {
  // 1 & 2. Request and return current session/application state
  return {
    ...applicationState,
    currentPanel
  };
}
