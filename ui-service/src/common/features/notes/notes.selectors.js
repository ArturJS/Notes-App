import { createSelector } from 'reselect';
import { ensureState } from 'redux-optimistic-ui';

export const getNotes = createSelector(
    state => ensureState(state.notes),
    notes => notes
);
