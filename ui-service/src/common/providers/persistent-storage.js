import localforage from 'localforage';

const isServer = typeof window === 'undefined';

const persistentStorage = isServer
    ? {}
    : localforage.createInstance({
          name: 'notesAppStorage'
      });

export default persistentStorage;
