jest.mock('redux-optimistic-ui', () => ({
    optimistic: jest.fn(reducer => {
        // eslint-disable-next-line
        reducer._wrappedWithOptimistic = true;

        return reducer;
    })
}));

jest.mock('../notes.actions', () => ({
    ADD_NOTE_SUCCESS: 'ADD_NOTE_SUCCESS',
    UPDATE_NOTE_SUCCESS: 'UPDATE_NOTE_SUCCESS',
    DELETE_NOTE_REQUEST: 'DELETE_NOTE_REQUEST',
    GET_ALL_NOTES_SUCCESS: 'GET_ALL_NOTES_SUCCESS',
    CHANGE_NOTE_ORDER_REQUEST: 'CHANGE_NOTE_ORDER_REQUEST',
    CLEAR_NOTES: 'CLEAR_NOTES'
}));

/* eslint-disable import/first */
import { optimistic } from 'redux-optimistic-ui';
import notesReducer from '../notes.reducer';
import {
    ADD_NOTE_SUCCESS,
    UPDATE_NOTE_SUCCESS,
    DELETE_NOTE_REQUEST,
    GET_ALL_NOTES_SUCCESS,
    CHANGE_NOTE_ORDER_REQUEST,
    CLEAR_NOTES
} from '../notes.actions';
/* eslint-enable import/first */

describe('auth.reducer.js', () => {
    it('should be wrapped with "optimistic" reducer enhancer', () => {
        // eslint-disable-next-line no-underscore-dangle
        expect(notesReducer._wrappedWithOptimistic).toBe(true);
        expect(optimistic).toHaveBeenCalledWith(notesReducer);
    });

    describe('ADD_NOTE_SUCCESS action', () => {
        it('should correctly process ADD_NOTE_SUCCESS action', () => {
            const newNote = {
                id: 2,
                title: 'test title 2',
                description: 'test description 2',
                files: []
            };
            const oldNote = {
                id: 1,
                title: 'test title 1',
                description: 'test description 1',
                files: []
            };
            const state = [
                {
                    ...newNote,
                    meta: {
                        transactionId: 1
                    }
                },
                oldNote
            ];
            const result = notesReducer(state, {
                type: ADD_NOTE_SUCCESS,
                payload: newNote,
                meta: {
                    optimistic: {
                        id: 1
                    }
                }
            });

            expect(result).toEqual([
                {
                    ...newNote,
                    meta: {}
                },
                oldNote
            ]);
        });
    });

    describe('UPDATE_NOTE_SUCCESS action', () => {
        it('should correctly process UPDATE_NOTE_SUCCESS action', () => {
            const otherNotes = [
                {
                    id: 1,
                    title: 'test title 1',
                    description: 'test description 1',
                    files: []
                }
            ];
            const state = [
                ...otherNotes,
                {
                    id: 2,
                    title: 'test title 2',
                    description: 'test description 2',
                    files: [],
                    meta: {
                        transactionId: 1
                    }
                }
            ];
            const updatedNote = {
                id: 2,
                title: 'test title 2',
                description: 'test description 2',
                files: [],
                meta: {}
            };
            const result = notesReducer(state, {
                type: UPDATE_NOTE_SUCCESS,
                meta: {
                    optimistic: {
                        id: 1
                    }
                }
            });

            expect(result).toEqual([...otherNotes, updatedNote]);
        });

        it('should NOT affect existing notes list of there is no such note', () => {
            const state = [
                {
                    id: 1,
                    title: 'test title 1',
                    description: 'test description 1',
                    files: []
                },
                {
                    id: 2,
                    title: 'test title 2',
                    description: 'test description 2',
                    files: []
                }
            ];
            const updatedNote = {
                id: 3,
                title: 'NEW test title 3',
                description: 'NEW test description 3',
                files: []
            };
            const result = notesReducer(state, {
                type: UPDATE_NOTE_SUCCESS,
                payload: updatedNote,
                meta: {
                    optimistic: {
                        id: 123
                    }
                }
            });

            expect(result).toEqual(state);
        });
    });

    describe('DELETE_NOTE_REQUEST action', () => {
        it('should correctly process DELETE_NOTE_REQUEST action', () => {
            const otherNotes = [
                {
                    id: 1,
                    title: 'test title 1',
                    description: 'test description 1',
                    files: []
                }
            ];
            const state = [
                ...otherNotes,
                {
                    id: 2,
                    title: 'test title 2',
                    description: 'test description 2',
                    files: []
                }
            ];

            expect(
                notesReducer(state, {
                    type: DELETE_NOTE_REQUEST,
                    payload: {
                        id: 2
                    }
                })
            ).toEqual(otherNotes);
        });
    });

    describe('GET_ALL_NOTES_SUCCESS action', () => {
        it('should correctly process GET_ALL_NOTES_SUCCESS action', () => {
            const oldState = [
                {
                    id: 2,
                    title: 'test title 2',
                    description: 'test description 2',
                    files: []
                }
            ];
            const newState = [
                {
                    id: 1,
                    title: 'test title 1',
                    description: 'test description 1',
                    files: []
                },
                ...oldState
            ];

            expect(
                notesReducer(oldState, {
                    type: GET_ALL_NOTES_SUCCESS,
                    payload: {
                        notes: newState
                    }
                })
            ).toEqual(newState);
        });
    });

    describe('CHANGE_NOTE_ORDER_REQUEST action', () => {
        it('should correctly process CHANGE_NOTE_ORDER_REQUEST action', () => {
            const notes = [
                {
                    id: 1,
                    title: 'test title 1',
                    description: 'test description 1',
                    files: []
                },
                {
                    id: 2,
                    title: 'test title 2',
                    description: 'test description 2',
                    files: []
                },
                {
                    id: 3,
                    title: 'test title 3',
                    description: 'test description 3',
                    files: []
                }
            ];
            const oldState = [...notes];
            const newState = [notes[1], notes[2], notes[0]];

            expect(
                notesReducer(oldState, {
                    type: CHANGE_NOTE_ORDER_REQUEST,
                    payload: {
                        oldIndex: 0,
                        newIndex: 2
                    }
                })
            ).toEqual(newState);
        });
    });

    describe('CLEAR_NOTES action', () => {
        it('should correctly process CLEAR_NOTES action', () => {
            const state = [
                {
                    id: 1,
                    title: 'test title 1',
                    description: 'test description 1',
                    files: []
                },
                {
                    id: 2,
                    title: 'test title 2',
                    description: 'test description 2',
                    files: []
                }
            ];

            expect(
                notesReducer(state, {
                    type: CLEAR_NOTES
                })
            ).toEqual([]);
        });
    });
});
