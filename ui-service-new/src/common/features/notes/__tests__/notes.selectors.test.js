import { getNotes } from '../notes.selectors';

describe('notes.selectors.js', () => {
    describe('"getNotes" selector', () => {
        it('should extract only needed data from state', () => {
            const expectedNotesState = [
                {
                    id: 1,
                    title: 'some note',
                    description: 'some note description',
                    files: ['file1.jpg']
                }
            ];
            const state = {
                excessiveInfo: 'some excessive info...',
                notes: expectedNotesState
            };

            expect(getNotes(state)).toEqual(expectedNotesState);
        });
    });
});
