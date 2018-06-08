jest.mock('react-collapse', () => ({
    // eslint-disable-next-line react/prop-types
    Collapse: ({ children, ...props }) => (
        <div className="react-collapse">
            <div className="props">{JSON.stringify(props, null, '    ')}</div>
            <div className="children">{children}</div>
        </div>
    )
}));

/* eslint-disable import/first */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Header from '../header.jsx';
/* eslint-enable import/first */

let originalWindowScroll;
const mockWindowScroll = () => {
    originalWindowScroll = window.scroll;
    window.scroll = jest.fn();
};
const unmockWindowScroll = () => {
    window.scroll = originalWindowScroll;
};

describe('<FieldError />', () => {
    beforeEach(mockWindowScroll);
    afterEach(unmockWindowScroll);

    it('renders correctly', () => {
        const tree = renderer.create(<Header>test content</Header>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    describe('toggle `isExpanded` state', () => {
        it('changes after click on .header-hamburger', () => {
            const wrapper = mount(<Header />);
            const { isExpanded: originalIsExpanded } = wrapper.instance().state;

            wrapper.find('.header-hamburger').simulate('click');

            const { isExpanded } = wrapper.instance().state;

            expect(isExpanded).not.toBe(originalIsExpanded);
        });

        it('changes after keyPress on .header-hamburger', () => {
            const wrapper = mount(<Header />);
            const { isExpanded: originalIsExpanded } = wrapper.instance().state;

            wrapper.find('.header-hamburger').simulate('keyPress');

            const { isExpanded } = wrapper.instance().state;

            expect(isExpanded).not.toBe(originalIsExpanded);
        });
    });

    describe('scrollTop', () => {
        it('scrolls to top after click on .icon-arrow-up', () => {
            const wrapper = mount(<Header />);

            wrapper.find('.icon-arrow-up').simulate('click');

            expect(window.scroll).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth'
            });
        });

        it('scrolls to top after keyPress on .icon-arrow-up', () => {
            const wrapper = mount(<Header />);

            wrapper.find('.icon-arrow-up').simulate('keyPress');

            expect(window.scroll).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    describe('scrollBottom', () => {
        it('scrolls to bottom after click on .icon-arrow-down', () => {
            const wrapper = mount(<Header />);

            wrapper.find('.icon-arrow-down').simulate('click');

            expect(window.scroll).toHaveBeenCalledWith({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });

        it('scrolls to top after keyPress on .icon-arrow-up', () => {
            const wrapper = mount(<Header />);

            wrapper.find('.icon-arrow-down').simulate('keyPress');

            expect(window.scroll).toHaveBeenCalledWith({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });
    });
});
