import React from 'react';
import renderer from 'react-test-renderer';
import Banner from '../banner';

describe('<Banner />', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(<Banner title="test title" body="test body" />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });
});
