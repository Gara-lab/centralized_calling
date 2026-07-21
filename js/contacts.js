// Dependencies
import Storage from './storage.js';
import * as UI from './ui.js';
import * as Events from './events.js';

/**
 * Retrieves all contacts from the storage module.
 * @returns {Array} List of contacts.
 */
export function getContacts() {
  return Storage.getCollection('contacts');
}

/**
 * Creates a new contact, validates data, updates storage, and refreshes the UI.
 * @param {Object} data - The contact data.
 * @returns {Object} The created contact.
 */
export function createContact(data) {
  // 1. Validate required information
  if (!data || !data.name) {
    throw new Error('Validation failed: Contact name is required.');
  }
  if (!data.email && !data.phone) {
    throw new Error('Validation failed: Email or phone number is required.');
  }

  // 2. Send data to Storage
  const newContact = Storage.addEntity('contacts', data);

  // 3. Emit contact created event
  Events.emit('contact:created', newContact);

  // 4. Refresh contact display
  render();

  // 5. Return created contact
  return newContact;
}

/**
 * Updates an existing contact, updates storage, and refreshes the UI.
 * @param {string|number} id - The contact ID.
 * @param {Object} changes - The updated values.
 * @returns {Object} The updated contact.
 */
export function updateContact(id, changes) {
  // 1. Send update request to Storage
  const updatedContact = Storage.updateEntity('contacts', id, changes);

  // 2. Emit contact updated event
  Events.emit('contact:updated', updatedContact);

  // 3. Refresh contact display
  render();

  // 4. Return updated contact
  return updatedContact;
}

/**
 * Deletes a contact, updates storage, and refreshes the UI.
 * @param {string|number} id - The contact ID.
 * @returns {boolean|Object} Result status of the deletion.
 */
export function deleteContact(id) {
  // 1. Send removal request to Storage
  const result = Storage.removeEntity('contacts', id);

  // 2. Emit contact removed event
  Events.emit('contact:removed', id);

  // 3. Refresh contact display
  render();

  // 4. Return result status
  return result;
}

/**
 * Searches for contacts matching the provided query.
 * @param {string} query - The search value.
 * @returns {Array} Filtered contact list.
 */
export function searchContacts(query) {
  if (!query || typeof query !== 'string') {
    return getContacts();
  }

  const contacts = getContacts();
  const lowerCaseQuery = query.toLowerCase().trim();

  // Compare search value against name, email, and phone
  return contacts.filter(contact => {
    const name = (contact.name || '').toLowerCase();
    const email = (contact.email || '').toLowerCase();
    const phone = (contact.phone || '').toLowerCase();

    return name.includes(lowerCaseQuery) || 
           email.includes(lowerCaseQuery) || 
           phone.includes(lowerCaseQuery);
  });
}

/**
 *
 * @param {Array} [contacts] - Optional contact data to render. Defaults to all contacts.
 */
export function render(contacts, container) {
  const contactList = contacts || getContacts();
  
  //
  const panel = document.createElement('section');
  panel.className = 'contacts-panel';
  panel.setAttribute('aria-label', 'Contacts List');

  if (contactList.length === 0) {
    panel.innerHTML = '<p class="empty-state">No contacts found.</p>';
  } else {
    const list = document.createElement('ul');
    list.className = 'contacts-list';

    contactList.forEach(contact => {
      const item = document.createElement('li');
      item.className = 'contact-item';
      item.dataset.id = contact.id;
      
      item.innerHTML = `
        <div class="contact-info">
          <strong class="contact-name">${contact.name}</strong>
          ${contact.email ? `<span class="contact-email">${contact.email}</span>` : ''}
          ${contact.phone ? `<span class="contact-phone">${contact.phone}</span>` : ''}
        </div>
        <div class="contact-actions">
          <button class="btn-view" data-action="view" data-id="${contact.id}">View</button>
          <button class="btn-edit" data-action="edit" data-id="${contact.id}">Edit</button>
          <button class="btn-delete" data-action="delete" data-id="${contact.id}">Delete</button>
        </div>
      `;
      list.appendChild(item);
    });

    panel.appendChild(list);
    panel.addEventListener('click', (event) => {
      const button = event.target.closest('button');

      if (!button) {
      return;
  }

      const action = button.dataset.action;
      const id = button.dataset.id;

      Events.emit(`contact:${action}`, { id });
});
  }

  // 2. Send content to UI module
  UI.render(panel, container);
}
