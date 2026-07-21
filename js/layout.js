import * as UI from './ui.js';
import * as Events from './events.js';
import Storage from './storage.js';

const Layout = (function () {
  // ==========================================
  // Internal State
  // ==========================================
  let activePanel = null;

  // Available application panels
  const AVAILABLE_PANELS = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'calls', name: 'Calls' },
    { id: 'contacts', name: 'Contacts' },
    { id: 'queue', name: 'Queue' },
    { id: 'notes', name: 'Notes' }
  ];

  // DOM Element References
  let layoutContainer = null;
  let headerContainer = null;
  let sidebarContainer = null;
  let workspaceContainer = null;

  // ==========================================
  // Private Helpers
  // ==========================================

  /**
   * createLayoutContainer
   * Creates the root layout structure with header, sidebar, and workspace elements.
   */
  function createLayoutContainer() {
    const container = document.createElement('div');
    container.id = 'app-layout';
    container.className = 'app-layout';

    headerContainer = document.createElement('header');
    headerContainer.id = 'app-header';
    headerContainer.className = 'app-header';

    sidebarContainer = document.createElement('nav');
    sidebarContainer.id = 'app-sidebar';
    sidebarContainer.className = 'app-sidebar';

    workspaceContainer = document.createElement('main');
    workspaceContainer.id = 'app-workspace';
    workspaceContainer.className = 'app-workspace';

    container.appendChild(headerContainer);

    const mainArea = document.createElement('div');
    mainArea.className = 'app-main';
    mainArea.appendChild(sidebarContainer);
    mainArea.appendChild(workspaceContainer);

    container.appendChild(mainArea);

    return container;
  }

  /**
   * createNavigationButton
   * Creates a navigation button for a specific panel.
   */
  function createNavigationButton(panel) {
    const button = document.createElement('button');
    button.className = 'nav-button';
    button.dataset.panel = panel.id;
    button.textContent = panel.name;

    button.addEventListener('click', () => {
      Events.emit('panel:changed', { panel: panel.id });
    });

    return button;
  }

  // ==========================================
  // Public Functions
  // ==========================================

  /**
   * initialize
   * Creates the main application layout and sets up initial state and event listeners.
   */
  function initialize() {
    // 1. Create the main application layout container
    layoutContainer = createLayoutContainer();

    // 2 & 3. Insert layout containers into the application root
    const appRoot = document.getElementById('app') || document.body;
    appRoot.appendChild(layoutContainer);

    // 4. Render initial header
    renderHeader();

    // 5. Render sidebar navigation
    renderSidebar();

    // 6. Set default active panel
    openPanel('dashboard');

    // 7. Subscribe to application events
    Events.on('user:statusChanged', () => {
      updateHeader();
    });

    Events.on('panel:changed', (data) => {
      openPanel(data.panel);
    });
  }

  /**
   * renderHeader
   * Retrieves user info and renders the header display.
   */
  function renderHeader() {
    // 1. Retrieve current user information and status from Storage
    const session = Storage.getState('session');

    const user = session.userId
      ? { name: session.userId }
      : null;

    const status = session.isLoggedIn
      ? 'Available'
      : 'Offline';

    const task = null;

    // 3. Create header DOM element
    const headerElement = document.createElement('div');
    headerElement.className = 'header-content';

    // 4. Display user name, current status, and current task
    const userNameEl = document.createElement('span');
    userNameEl.className = 'user-name';
    userNameEl.textContent = user ? user.name : 'Unknown User';

    const statusEl = document.createElement('span');
    statusEl.className = 'user-status';
    statusEl.textContent = status || 'Offline';

    headerElement.appendChild(userNameEl);
    headerElement.appendChild(statusEl);

    if (task) {
      const taskEl = document.createElement('span');
      taskEl.className = 'current-task';
      taskEl.textContent = `Current Task: ${task}`;
      headerElement.appendChild(taskEl);
    }

    // 5. Send generated element to UI module
    UI.render(headerElement, headerContainer);
  }

  /**
   * renderSidebar
   * Defines available panels and renders the sidebar navigation.
   */
  function renderSidebar() {
    sidebarContainer.innerHTML = '';

    // 1 & 2. Define available panels and create navigation elements
    AVAILABLE_PANELS.forEach((panel) => {
      // 3 & 4. Create button with identifier, display name, and click handler
      const button = createNavigationButton(panel);
      sidebarContainer.appendChild(button);
    });
  }

  /**
   * openPanel
   * Validates, updates state, and loads the requested panel into the workspace.
   */
  function openPanel(panelName) {
    // 1. Validate that panel name exists
    const panelExists = AVAILABLE_PANELS.some((p) => p.id === panelName);
    if (!panelExists) {
      console.warn(`Layout: Panel "${panelName}" does not exist.`);
      return null;
    }

    // 2. Update activePanel
    activePanel = panelName;

    // 3. Emit panel:opened event
    Events.emit('panel:opened', { panel: panelName });

    // 4. Update workspace container
    workspaceContainer.innerHTML = '';
    const panelContainer = document.createElement('div');
    panelContainer.id = `panel-${panelName}`;
    panelContainer.className = 'workspace-panel';
    workspaceContainer.appendChild(panelContainer);

    // 5. Load the requested module panel through the application event system
    // 6. Do not directly execute feature business logic
    Events.emit('panel:load', { 
      panel: panelName, 
      container: panelContainer 
    });

    return activePanel;
  }

  /**
   * updateHeader
   * Rebuilds and replaces the header display with the latest user state.
   */
  function updateHeader() {
    // 1. Retrieve latest user state (handled inside renderHeader)
    // 2. Rebuild header content
    // 3. Replace previous header display
    headerContainer.innerHTML = '';
    renderHeader();
  }

  // ==========================================
  // Module Output
  // ==========================================
  return {
    initialize,
    renderHeader,
    renderSidebar,
    openPanel,
    updateHeader
  };
})();

export default Layout;
