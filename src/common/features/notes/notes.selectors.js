import { createSelector } from 'reselect';

export const getNotes = createSelector(state => state.notes, notes => notes);
