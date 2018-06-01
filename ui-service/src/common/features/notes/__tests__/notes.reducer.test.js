import notesReducer from '../notes.reducer';

jest.mock('../notes.actions', () => ({
    ADD_NOTE_SUCCESS: 'ADD_NOTE_SUCCESS',
    UPDATE_NOTE_SUCCESS: 'UPDATE_NOTE_SUCCESS',
    DELETE_NOTE_SUCCESS: 'DELETE_NOTE_SUCCESS',
    GET_ALL_NOTES_SUCCESS: 'GET_ALL_NOTES_SUCCESS',
    CHANGE_NOTE_ORDER_REQUEST: 'CHANGE_NOTE_ORDER_REQUEST',
    CLEAR_NOTES: 'CLEAR_NOTES'
}));

// eslint-disable-next-line import/first
import {
    ADD_NOTE_SUCCESS,
    UPDATE_NOTE_SUCCESS,
    DELETE_NOTE_SUCCESS,
    GET_ALL_NOTES_SUCCESS,
    CHANGE_NOTE_ORDER_REQUEST,
    CLEAR_NOTES
} from '../notes.actions';

describe('auth.reducer.js', () => {
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
            const state = [oldNote];

            expect(
                notesReducer(state, {
                    type: ADD_NOTE_SUCCESS,
                    payload: newNote
                })
            ).toEqual([newNote, ...state]);
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
                    files: []
                }
            ];
            const updatedNote = {
                id: 2,
                title: 'NEW test title 2',
                description: 'NEW test description 2',
                files: []
            };

            expect(
                notesReducer(state, {
                    type: UPDATE_NOTE_SUCCESS,
                    payload: updatedNote
                })
            ).toEqual([...otherNotes, updatedNote]);
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

            expect(
                notesReducer(state, {
                    type: UPDATE_NOTE_SUCCESS,
                    payload: updatedNote
                })
            ).toEqual(state);
        });
    });

    describe('DELETE_NOTE_SUCCESS action', () => {
        it('should correctly process DELETE_NOTE_SUCCESS action', () => {
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
                    type: DELETE_NOTE_SUCCESS,
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
