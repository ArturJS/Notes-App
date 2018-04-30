export { default as authReducer } from './auth.reducer';
export { default as watchAuth } from './auth.saga';
import * as _authActions from './auth.actions';
import * as _authSelectors from './auth.selectors';

export const authActions = _authActions;
export const authSelectors = _authSelectors;
