const Storage = (function () {
    let workspace = null;
    let counters = {};

    // Default state values
    const defaultSettings = {
        theme: 'light',
        notifications: true,
        language: 'en'
    };

    const defaultSession = {
        isLoggedIn: false,
        userId: null,
        token: null
    };

    // --- Workspace Initialization & Reset ---

    function initializeWorkspace() {
        workspace = {
            users: [],
            contacts: [],
            queue: [],
            calls: [],
            notes: [],
            tasks: [],
            settings: { ...defaultSettings },
            session: { ...defaultSession }
        };

        counters = {
            usersId: 0,
            contactsId: 0,
            queueId: 0,
            callsId: 0,
            notesId: 0,
            tasksId: 0
        };

        return workspace;
    }

    function resetWorkspace() {
        workspace = null;
        return initializeWorkspace();
    }

    // --- ID Generation ---

    function generateId(entity) {
        const counterKey = `${entity}Id`;
        if (counters[counterKey] === undefined) {
            throw new Error(`Invalid entity for ID generation: ${entity}`);
        }
        counters[counterKey] += 1;
        return counters[counterKey];
    }

    // --- Collection Management ---

    function getCollection(entity) {
        if (!workspace || !Array.isArray(workspace[entity])) {
            throw new Error(`Collection not found: ${entity}`);
        }
        return workspace[entity];
    }

    function addEntity(entity, data) {
        const collection = getCollection(entity);
        const id = generateId(entity);
        const newEntity = { ...data, id };
        
        collection.push(newEntity);
        return newEntity;
    }

    function updateEntity(entity, id, changes) {
        const collection = getCollection(entity);
        const index = collection.findIndex(item => item.id === id);
        
        if (index === -1) {
            return null;
        }
        
        // Apply changes while preserving the original ID
        const updatedEntity = { ...collection[index], ...changes, id };
        collection[index] = updatedEntity;
        
        return updatedEntity;
    }

    function removeEntity(entity, id) {
        const collection = getCollection(entity);
        const index = collection.findIndex(item => item.id === id);
        
        if (index === -1) {
            return false;
        }
        
        collection.splice(index, 1);
        return true;
    }

    function getEntityById(entity, id) {
        const collection = getCollection(entity);
        return collection.find(item => item.id === id) || null;
    }

    // --- State Management ---

    function getState(name) {
        if (!workspace || !(name in workspace)) {
            throw new Error(`State not found: ${name}`);
        }
        return workspace[name];
    }

    function updateState(name, changes) {
        const state = getState(name);
        const updatedState = { ...state, ...changes };
        
        workspace[name] = updatedState;
        return updatedState;
    }

    function resetState(name) {
        let defaultState;
        
        if (name === 'settings') {
            defaultState = { ...defaultSettings };
        } else if (name === 'session') {
            defaultState = { ...defaultSession };
        } else {
            throw new Error(`Unknown state: ${name}`);
        }
        
        workspace[name] = defaultState;
        return defaultState;
    }

    // Initialize workspace on module load
    initializeWorkspace();

    // --- Public API ---
    return {
        initializeWorkspace,
        resetWorkspace,
        generateId,
        getCollection,
        addEntity,
        updateEntity,
        removeEntity,
        getEntityById,
        getState,
        updateState,
        resetState
    };
})();

export default Storage;
