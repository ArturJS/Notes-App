jest.mock('../components/files-list-item', () => props => (
    <div className="files-list-item">
        {JSON.stringify(
            props,
            (prop, value) => {
                if (typeof value === 'function') {
                    return `function ${prop}`;
                }

                return value;
            },
            '  '
        )}
    </div>
));

/* eslint-disable import/first */
import React from 'react';
import renderer from 'react-test-renderer';
import FilesList from '../file-list';
/* eslint-enable import/first */

describe('<FilesList />', () => {
    it('renders nothing if no files', () => {
        const tree = renderer.create(<FilesList files={[]} />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders correctly list of files', () => {
        const files = [
            {
                id: 1,
                name: 'File 1'
            },
            {
                id: 2,
                name: 'File 2',
                remove: () => {}
            }
        ];
        const tree = renderer.create(<FilesList files={files} />).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
