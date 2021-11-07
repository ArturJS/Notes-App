import {
    ADD_NOTE_REQUEST,
    ADD_NOTE_SUCCESS,
    ADD_NOTE_FAILURE,
    addNoteRequest,
    addNoteSuccess,
    addNoteFailure,
    UPDATE_NOTE_REQUEST,
    UPDATE_NOTE_SUCCESS,
    UPDATE_NOTE_FAILURE,
    updateNoteRequest,
    updateNoteSuccess,
    updateNoteFailure,
    DELETE_NOTE_REQUEST,
    DELETE_NOTE_SUCCESS,
    DELETE_NOTE_FAILURE,
    deleteNoteRequest,
    deleteNoteSuccess,
    deleteNoteFailure,
    GET_ALL_NOTES_REQUEST,
    GET_ALL_NOTES_SUCCESS,
    GET_ALL_NOTES_FAILURE,
    getAllNotesRequest,
    getAllNotesSuccess,
    getAllNotesFailure,
    CHANGE_NOTE_ORDER_REQUEST,
    CHANGE_NOTE_ORDER_SUCCESS,
    CHANGE_NOTE_ORDER_FAILURE,
    changeNoteOrderRequest,
    changeNoteOrderSuccess,
    changeNoteOrderFailure,
    CLEAR_NOTES,
    clearNotes
} from '../notes.actions';

describe('notes.actions.js', () => {
    it('should export correct action types', () => {
        expect([
            ADD_NOTE_REQUEST,
            ADD_NOTE_SUCCESS,
            ADD_NOTE_FAILURE,
            UPDATE_NOTE_REQUEST,
            UPDATE_NOTE_SUCCESS,
            UPDATE_NOTE_FAILURE,
            DELETE_NOTE_REQUEST,
            DELETE_NOTE_SUCCESS,
            DELETE_NOTE_FAILURE,
            GET_ALL_NOTES_REQUEST,
            GET_ALL_NOTES_SUCCESS,
            GET_ALL_NOTES_FAILURE,
            CHANGE_NOTE_ORDER_REQUEST,
            CHANGE_NOTE_ORDER_SUCCESS,
            CHANGE_NOTE_ORDER_FAILURE,
            CLEAR_NOTES
        ]).toEqual([
            'ADD_NOTE_REQUEST',
            'ADD_NOTE_SUCCESS',
            'ADD_NOTE_FAILURE',
            'UPDATE_NOTE_REQUEST',
            'UPDATE_NOTE_SUCCESS',
            'UPDATE_NOTE_FAILURE',
            'DELETE_NOTE_REQUEST',
            'DELETE_NOTE_SUCCESS',
            'DELETE_NOTE_FAILURE',
            'GET_ALL_NOTES_REQUEST',
            'GET_ALL_NOTES_SUCCESS',
            'GET_ALL_NOTES_FAILURE',
            'CHANGE_NOTE_ORDER_REQUEST',
            'CHANGE_NOTE_ORDER_SUCCESS',
            'CHANGE_NOTE_ORDER_FAILURE',
            'CLEAR_NOTES'
        ]);
    });

    describe('ADD_NOTE actions', () => {
        describe('"addNoteRequest" action creator', () => {
            it('should return object with correct "type"', () => {
                const payload = {
                    title: 'test note title',
                    description: 'test note description',
                    files: []
                };
                const result = addNoteRequest({
                    ...payload,
                    extraField: 'extraValue'
                });

                expect(result).toEqual({
                    type: ADD_NOTE_REQUEST,
                    payload,
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });

        describe('"addNoteSuccess" action creator', () => {
            it('should return object with correct "type"', () => {
                const payload = {
                    id: 1,
                    title: 'test note title',
                    description: 'test note description',
                    files: []
                };
                const result = addNoteSuccess({
                    ...payload,
                    extraField: 'extraValue'
                });

                expect(result).toEqual({
                    type: ADD_NOTE_SUCCESS,
                    payload,
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });

        describe('"addNoteFailure" action creator', () => {
            it('should return object with correct "type"', () => {
                const extraPayload = {
                    title: 'test note title',
                    description: 'test note description',
                    files: []
                };
                const result = addNoteFailure(extraPayload);

                expect(result).toEqual({
                    type: ADD_NOTE_FAILURE,
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });
    });

    describe('UPDATE_NOTE actions', () => {
        describe('"updateNoteRequest" action creator', () => {
            it('should return object with correct "type"', () => {
                const payload = {
                    id: 1,
                    title: 'test note title',
                    description: 'test note description'
                };
                const result = updateNoteRequest({
                    ...payload,
                    extraField: 'extraValue'
                });

                expect(result).toEqual({
                    type: UPDATE_NOTE_REQUEST,
                    payload,
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });

        describe('"updateNoteSuccess" action creator', () => {
            it('should return object with correct "type"', () => {
                const payload = {
                    id: 1,
                    title: 'test note title',
                    description: 'test note description'
                };
                const result = updateNoteSuccess({
                    ...payload,
                    extraField: 'extraValue'
                });

                expect(result).toEqual({
                    type: UPDATE_NOTE_SUCCESS,
                    payload,
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });

        describe('"updateNoteFailure" action creator', () => {
            it('should return object with correct "type"', () => {
                const result = updateNoteFailure(1);

                expect(result).toEqual({
                    type: UPDATE_NOTE_FAILURE,
                    payload: {
                        id: 1
                    },
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });
    });

    describe('DELETE_NOTE actions', () => {
        describe('"deleteNoteRequest" action creator', () => {
            it('should return object with correct "type"', () => {
                const result = deleteNoteRequest(123);

                expect(result).toEqual({
                    type: DELETE_NOTE_REQUEST,
                    payload: {
                        id: 123
                    },
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });

        describe('"deleteNoteSuccess" action creator', () => {
            it('should return object with correct "type"', () => {
                const result = deleteNoteSuccess(123);

                expect(result).toEqual({
                    type: DELETE_NOTE_SUCCESS,
                    payload: {
                        id: 123
                    },
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });

        describe('"deleteNoteFailure" action creator', () => {
            it('should return object with correct "type"', () => {
                const result = deleteNoteFailure(123);

                expect(result).toEqual({
                    type: DELETE_NOTE_FAILURE,
                    payload: {
                        id: 123
                    },
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });
    });

    describe('GET_ALL_NOTES actions', () => {
        describe('"getAllNotesRequest" action creator', () => {
            it('should return object with correct "type"', () => {
                const result = getAllNotesRequest();

                expect(result).toEqual({
                    type: GET_ALL_NOTES_REQUEST
                });
            });
        });

        describe('"getAllNotesSuccess" action creator', () => {
            it('should return object with correct "type"', () => {
                const notes = [
                    {
                        id: 1,
                        title: 'test note title',
                        description: 'test note description',
                        files: []
                    }
                ];
                const result = getAllNotesSuccess(notes);

                expect(result).toEqual({
                    type: GET_ALL_NOTES_SUCCESS,
                    payload: {
                        notes
                    }
                });
            });
        });

        describe('"getAllNotesFailure" action creator', () => {
            it('should return object with correct "type"', () => {
                const result = getAllNotesFailure();

                expect(result).toEqual({
                    type: GET_ALL_NOTES_FAILURE
                });
            });
        });
    });

    describe('CHANGE_NOTE_ORDER actions', () => {
        describe('"changeNoteOrderRequest" action creator', () => {
            it('should return object with correct "type"', () => {
                const payload = {
                    id: 1,
                    oldIndex: 2,
                    newIndex: 1,
                    commitChanges: true
                };
                const result = changeNoteOrderRequest(payload);

                expect(result).toEqual({
                    type: CHANGE_NOTE_ORDER_REQUEST,
                    payload,
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });

        describe('"changeNoteOrderSuccess" action creator', () => {
            it('should return object with correct "type"', () => {
                const result = changeNoteOrderSuccess(123);

                expect(result).toEqual({
                    type: CHANGE_NOTE_ORDER_SUCCESS,
                    payload: {
                        id: 123
                    },
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });

        describe('"changeNoteOrderFailure" action creator', () => {
            it('should return object with correct "type"', () => {
                const result = changeNoteOrderFailure(123);

                expect(result).toEqual({
                    type: CHANGE_NOTE_ORDER_FAILURE,
                    payload: {
                        id: 123
                    },
                    meta: {
                        isOptimistic: true,
                        synced: false
                    }
                });
            });
        });
    });

    describe('CLEAR_NOTES action', () => {
        describe('"clearNotes" action creator', () => {
            it('should return object with correct "type"', () => {
                const result = clearNotes();

                expect(result).toEqual({
                    type: CLEAR_NOTES
                });
            });
        });
    });
});
