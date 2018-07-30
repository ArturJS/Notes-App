jest.mock('@common/features/modal', () => ({
    modalProvider: {
        showConfirm: jest.fn()
    }
}));
jest.mock('../../../../file-list', () => props => (
    <div className="file-list">{JSON.stringify(props, null, '  ')}</div>
));

/* eslint-disable import/first */
import React from 'react';
import renderer from 'react-test-renderer';
import NoteReadonlyMode from '../note-readonly-mode';
/* eslint-enable import/first */

describe('<NoteReadonlyMode />', () => {
    it('renders correctly', () => {
        const note = {
            id: 1,
            title: 'Note test title',
            description: 'Note test description',
            files: [
                {
                    id: 12,
                    downloadPath: '/test/download/path',
                    filename: 'file name'
                }
            ],
            trackId: 1,
            meta: {
                transactionId: 1
            }
        };
        const tree = renderer
            .create(
                <NoteReadonlyMode
                    note={note}
                    onRemove={() => {}}
                    onEdit={() => {}}
                />
            )
            .toJSON();

        expect(tree).toMatchSnapshot();
    });
});
