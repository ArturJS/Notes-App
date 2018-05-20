import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../button.jsx';

describe('<Button />', () => {
    it('renders correctly', () => {
        const tree = renderer
            .create(
                <Button type="submit" theme="hot" className="btn-test-class">
                    <span>Inner content...</span>
                </Button>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
