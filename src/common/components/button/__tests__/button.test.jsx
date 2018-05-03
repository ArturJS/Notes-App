import React from 'react';
import render from 'preact-render-to-json';
import Button from '../button.jsx';

describe('<Button />', () => {
    it('renders correctly', () => {
        const tree = render(
            <Button type="submit" theme="hot" className="btn-test-class">
                <span>Inner content...</span>
            </Button>
        );
        expect(tree).toMatchSnapshot();
    });
});
