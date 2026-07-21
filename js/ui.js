/**
 * UI Module
 * 
 * Purpose: Manage interface rendering and visual updates.
 * Responsibilities: Render application interface, update visible s, 
 * create reusable UI elements, display messages and status changes.
 */

/**
 * Initializes the main application interface.
 * Creates main interface containers and prepares the UI structure.
 * 
 * @returns {HTMLElement} The rendered main interface container.
 */

/**
 * Renders content into the main panel.
 * 
 * @param {HTMLElement|string} Content - The content to render (DOM node or HTML string).
 * @returns {HTMLElement|null} The updated panel element.
 */
export function render(content, container) {
  // 1. Clear current 
  container.innerHTML = '';

  // 2. Insert new  content
  if (typeof content === 'string') {
    container.innerHTML = content;
  } else if (content instanceof Node) {
    container.appendChild(content);
  }

  // 3. Update displayed interface (handled by DOM reflow)
  return container;
}

/**
 * Updates the displayed value of a specific UI element.
 * 
 * @param {HTMLElement|string} element - The element or CSS selector to update.
 * @param {any} data - The new data to display.
 * @returns {HTMLElement|null} The updated element.
 */
export function updateElement(element, data) {
  // 1. Find element
  const target = typeof element === 'string' 
    ? document.querySelector(element) 
    : element;

  if (!target) return null;

  // 2. Update displayed value
  const isFormElement = target instanceof HTMLInputElement || 
                        target instanceof HTMLTextAreaElement || 
                        target instanceof HTMLSelectElement;

  if (isFormElement) {
    target.value = data;
  } else {
    target.textContent = data;
  }

  return target;
}

/**
 * Displays a temporary message to the user.
 * 
 * @param {string} message - The message text to display.
 */
export function showMessage(message) {
  const container = document.getElementById('message-container');
  if (!container) return;

  // 1. Create message display
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  messageElement.textContent = message;

  // 2. Show message
  container.appendChild(messageElement);

  // 3. Remove message after completion (3 seconds)
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
}
