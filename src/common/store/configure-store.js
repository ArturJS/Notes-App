import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './root.reducer';
import rootSaga from './root.saga';
import optimisticMiddleware from './optimistic.middleware';
import { sleep } from '../utils';

export default initialState => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(optimisticMiddleware, sagaMiddleware)
    );

    sleep(0).then(() => {
        // necessary to avoid problem when not all modules are resolved
        // in particular when one of sagas trying
        // to dispatch GET_ALL_NOTES_REQUEST action
        // but `import { notesApi } from '../../api';` in notes.saga.js
        // not resolved yet
        sagaMiddleware.run(rootSaga);
    });

    return store;
};
