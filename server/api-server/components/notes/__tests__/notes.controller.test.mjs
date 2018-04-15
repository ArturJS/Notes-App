import notesService from '../notes.service';
import notesController from '../notes.controller';

describe('NotesController', () => {
    describe('getAll', () => {
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

            expect(ctx.body).toEqual(notes);
        });
    });
});
