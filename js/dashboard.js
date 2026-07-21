// dashboard.js

import Storage from './storage.js';
import * as UI from './ui.js';
import * as Events from './events.js';

/**
 * Loads the required raw dashboard data from the Storage module.
 * @returns {Object} Raw dashboard data
 */
function loadDashboardData() {
  return {
    session: Storage.getState('session') || {},
    operations: {
      activeTasks: Storage.getCollection('tasks').length,
      pendingCalls: Storage.getCollection('queue').length
    }
  };
}

/**
 * Prepares and formats the dashboard content for display.
 * @param {Object} rawData - Raw data retrieved from storage
 * @returns {Object} Formatted dashboard data
 */
function prepareDashboardContent(rawData) {
  return {
    user: rawData.session.userId || 'Guest',
    sessionId: rawData.session.token || 'N/A',
    activeTasks: rawData.operations.activeTasks || 0,
    pendingCalls: rawData.operations.pendingCalls || 0,
    lastRefresh: new Date().toLocaleTimeString()
  };
}

/**
 * Initializes the dashboard module.
 * Loads data, prepares content, and renders the initial panel.
 */
export function initialize() {
  // 1. Load required dashboard data.
  const rawData = loadDashboardData();
  
  // 2. Prepare dashboard content.
  const dashboardData = prepareDashboardContent(rawData);
  
  // 3. Render dashboard panel.
  render(dashboardData);
  
  // Subscribe to relevant events to trigger automatic refreshes
  Events.on('session:updated', refresh);
  Events.on('data:changed', refresh);
}

/**
 * Refreshes the dashboard display with the latest data.
 */
export function refresh() {
  // 1. Retrieve updated data.
  const rawData = loadDashboardData();
  
  // 2. Recalculate displayed information.
  const dashboardData = prepareDashboardContent(rawData);
  
  // 3. Update dashboard panel.
  render(dashboardData);
}

/**
 * Renders the dashboard panel and sends the content to the UI module.
 * @param {Object} dashboardData - Prepared data to be displayed
 */
export function render(dashboardData) {
  // 1. Create dashboard layout & 2. Insert data values.
  const dashboardHTML = `
    <section class="dashboard-panel">
      <header class="dashboard-header">
        <h2>Workspace Dashboard</h2>
        <span class="refresh-time">Last updated: ${dashboardData.lastRefresh}</span>
      </header>
      
      <div class="dashboard-content">
        <div class="info-card session-info">
          <h3>Current Session</h3>
          <p><strong>User:</strong> ${dashboardData.user}</p>
          <p><strong>Session ID:</strong> ${dashboardData.sessionId}</p>
        </div>
        
        <div class="info-card operational-data">
          <h3>Operational Data</h3>
          <p><strong>Active Tasks:</strong> ${dashboardData.activeTasks}</p>
          <p><strong>Pending Calls:</strong> ${dashboardData.pendingCalls}</p>
        </div>
      </div>
    </section>
  `;
  
  // 3. Send content to UI module.
  UI.render(dashboardHTML, document.getElementById('panel-dashboard'));
}
