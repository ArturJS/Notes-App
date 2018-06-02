import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './root.reducer';
import rootSaga from './root.saga';
import optimisticMiddleware from './optimistic.middleware';

export default initialState => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(optimisticMiddleware, sagaMiddleware)
    );

    sagaMiddleware.run(rootSaga);

    return store;
};
