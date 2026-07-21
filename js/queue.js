/**
 * Queue Module
 * Manages the call queue workflow.
 * 
 * Dependencies: Storage, UI, Events
 */

import * as Storage from './storage.js';
import * as UI from './ui.js';
import * as Events from './events.js';

/**
 * Retrieves the next available contact from the waiting queue.
 * @returns {Object|null} The next queue item or null if queue is empty.
 */
function getNextContact() {
  const allItems = Storage.getQueueItems();
  const waitingItems = allItems.filter(item => item.status === 'waiting');

  if (waitingItems.length === 0) {
    return null;
  }

  // Select the first available item (assumes storage returns in chronological order)
  return waitingItems[0];
}

/**
 * Assigns a queue item to the current user and updates its status.
 * @param {Object} queueItem - The queue item to assign.
 * @returns {Object|null} The updated queue item or null if invalid.
 */
function assignContact(queueItem) {
  if (!queueItem) {
    return null;
  }

  const currentUser = Storage.getCurrentUser();
  
  // Update item properties
  queueItem.status = 'assigned';
  queueItem.assignedTo = currentUser.id;
  queueItem.assignedAt = new Date().toISOString();

  // Save changes and notify system
  Storage.saveQueueItem(queueItem);
  Events.emit('queue:updated', queueItem);

  return queueItem;
}

/**
 * Marks a specific queue item as completed.
 * @param {string} queueItemId - The ID of the queue item to complete.
 * @returns {Object|null} The updated queue item or null if not found.
 */
function completeQueueItem(queueItemId) {
  const queueItem = Storage.getQueueItemById(queueItemId);
  
  if (!queueItem) {
    return null;
  }

  // Update status
  queueItem.status = 'completed';
  queueItem.completedAt = new Date().toISOString();

  // Save changes and notify system
  Storage.saveQueueItem(queueItem);
  Events.emit('queue:updated', queueItem);

  return queueItem;
}

/**
 * Renders the queue panel and sends it to the UI module.
 * @param {Array} queueData - Array of queue items to display.
 * @returns {HTMLElement} The rendered queue panel element.
 */
function render(queueData) {
  const panel = document.createElement('div');
  panel.className = 'queue-panel';

  if (!queueData || queueData.length === 0) {
    panel.innerHTML = '<p class="queue-empty">No contacts in queue.</p>';
    UI.renderPanel(panel);
    return panel;
  }

  const list = document.createElement('ul');
  list.className = 'queue-list';

  queueData.forEach(item => {
    const listItem = document.createElement('li');
    listItem.className = 'queue-item';
    listItem.dataset.itemId = item.id;
    
    listItem.innerHTML = `
      <span class="contact-name">${item.contactName}</span>
      <span class="status ${item.status}">${item.status}</span>
    `;
    
    list.appendChild(listItem);
  });

  panel.appendChild(list);
  
  // Send content to UI module
  UI.renderPanel(panel);

  return panel;
}

export default {
  getNextContact,
  assignContact,
  completeQueueItem,
  render
};
