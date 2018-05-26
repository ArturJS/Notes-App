import notesService from '../notes.service';
import notesController from '../notes.controller';

describe('NotesController', () => {
    describe('getAll()', () => {
        it('should process request', async () => {
            const userId = 'test user id';
            const ctx = {
                session: {
                    passport: {
                        user: {
                            id: userId
                        }
                    }
                }
            };
            const notes = [
                {
                    id: 1,
                    title: 'Note 1',
                    description: 'Note description 1',
                    files: ['file 1']
                }
            ];
            notesService.getAll = jest.fn(async () => notes);

            await notesController.getAll(ctx);

            expect(notesService.getAll).toBeCalledWith(userId);
            expect(ctx.body).toEqual(notes);
        });
    });

    describe('getById()', () => {
        it('should process request', async () => {
            const userId = 'test user id';
            const noteId = '123';
            const expectedNoteId = +noteId;
            const ctx = {
                session: {
                    passport: {
                        user: {
                            id: userId
                        }
                    }
                },
                params: {
                    id: noteId
                }
            };
            const note = {
                id: 123,
                title: 'Note 123',
                description: 'Note description 123'
            };
            notesService.getById = jest.fn(async () => note);

            await notesController.getById(ctx);

            expect(notesService.getById).toBeCalledWith(userId, expectedNoteId);
            expect(ctx.body).toEqual({
                ...note,
                files: []
            });
        });
    });

    describe('create()', () => {
        it('should process request', async () => {
            const userId = 'test user id';
            const note = {
                id: 123,
                title: 'Note 123',
                description: 'Note description 123'
            };
            const ctx = {
                session: {
                    passport: {
                        user: {
                            id: userId
                        }
                    }
                },
                request: {
                    body: note
                }
            };
            notesService.create = jest.fn(async () => note);

            await notesController.create(ctx);

            expect(notesService.create).toBeCalledWith(userId, note);
            expect(ctx.body).toEqual({
                ...note,
                files: []
            });
        });
    });

    describe('update()', () => {
        it('should process request', async () => {
            const userId = 'test user id';
            const note = {
                id: 123,
                title: 'Note 123',
                description: 'Note description 123'
            };
            const ctx = {
                session: {
                    passport: {
                        user: {
                            id: userId
                        }
                    }
                },
                request: {
                    body: note
                }
            };
            notesService.update = jest.fn(async () => note);

            await notesController.update(ctx);

            expect(notesService.update).toBeCalledWith(userId, note);
            expect(ctx.body).toEqual({
                ...note,
                files: []
            });
        });
    });

    describe('reorder()', () => {
        it('should process request', async () => {
            const userId = 'test user id';
            const requestPayload = {
                noteId: 'noteId',
                reorderingType: 'reorderingType',
                anchorNoteId: 'anchorNoteId'
            };
            const ctx = {
                session: {
                    passport: {
                        user: {
                            id: userId
                        }
                    }
                },
                request: {
                    body: requestPayload
                }
            };
            notesService.reorder = jest.fn();

            await notesController.reorder(ctx);

            expect(notesService.reorder).toBeCalledWith({
                userId,
                ...requestPayload
            });
            expect(ctx.body).toBe(0);
        });
    });

    describe('remove()', () => {
        it('should process request', async () => {
            const userId = 'test user id';
            const noteId = '123';
            const ctx = {
                session: {
                    passport: {
                        user: {
                            id: userId
                        }
                    }
                },
                params: {
                    id: noteId
                }
            };
            notesService.remove = jest.fn();

            await notesController.remove(ctx);

            expect(notesService.remove).toBeCalledWith(userId, +noteId);
            expect(ctx.body).toBe(0);
        });
    });
});
