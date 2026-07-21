import Storage from './storage.js';
import * as Events from './events.js';
import * as UI from './ui.js';
import Layout from './layout.js';
import * as Dashboard from './dashboard.js';
import * as Contacts from './contacts.js';
import * as Calls from './calls.js';
import Queue from './queue.js';

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

function initializeTestData() {
  const existingContacts = Storage.getCollection('contacts');

  if (existingContacts.length > 0) {
    return;
  }

  const contact = Storage.addEntity('contacts', {
    name: 'John Smith',
    phone: '123456789',
    email: 'john@example.com'
  });

  Storage.addEntity('queue', {
    contactId: contact.id,
    contactName: contact.name,
    status: 'waiting'
  });

  Storage.addEntity('tasks', {
    title: 'Follow up call',
    status: 'pending'
  });
}
/**
 * Starts the application.
 * Initializes core modules, loads default state, and displays the initial panel.
 */
export function start() {
  // 1. Initialize workspace through Storage
  Storage.initializeWorkspace();
  initializeTestData();
  
  // 4. Load default application state
  applicationState = loadDefaultState();
  
  Events.on('panel:load', (data) => {
  switch (data.panel) {
    case 'dashboard':
      Dashboard.refresh();
      break;

    case 'contacts':
      Contacts.render(undefined, data.container);
      break;

    case 'calls':
      Calls.render(undefined, data.container);
      break;

    case 'queue':
      Queue.render(undefined, data.container);
      break;
  }
});
  Layout.initialize();
}

/**
 * Changes the active panel in the application.
 * @param {string} panel - The name of the panel to display.
 */
export function changePanel(panel) {
  // 1 & 2. Receive requested panel and notify UI to render it
  UI.render(panel, container);
  
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

start();
