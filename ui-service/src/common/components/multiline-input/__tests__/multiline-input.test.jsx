import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import MultilineInput from '../multiline-input';

describe('<MultilineInput />', () => {
    beforeEach(() => {
        jest
            .spyOn(window, 'requestAnimationFrame')
            .mockImplementation(cb => cb());
    });

    afterEach(() => {
        window.requestAnimationFrame.mockRestore();
    });

    it('renders correctly', () => {
        const props = {
            input: {
                onChange: () => {},
                value: 'test value'
            },
            className: 'test-class-name',
            placeholder: 'test placeholder'
        };
        const tree = renderer.create(<MultilineInput {...props} />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should invoke `autofitContent` method after `componentDidMount`', () => {
        const props = {
            input: {
                onChange: () => {},
                value: 'test value'
            },
            className: 'test-class-name',
            placeholder: 'test placeholder'
        };
        const wrapper = mount(<MultilineInput {...props} />);
        const instance = wrapper.instance();

        jest.spyOn(instance, 'autofitContent');
        instance.componentDidMount();

        expect(instance.autofitContent).toHaveBeenCalled();
        expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should invoke `autofitContent` method after `componentDidUpdate` if no value', () => {
        const props = {
            input: {
                onChange: () => {},
                value: 'test value'
            },
            className: 'test-class-name',
            placeholder: 'test placeholder'
        };
        const wrapper = mount(<MultilineInput {...props} />);

        wrapper.setProps({
            ...props,
            input: {
                onChange: () => {},
                value: ''
            }
        });

        const instance = wrapper.instance();

        jest.spyOn(instance, 'autofitContent');
        instance.componentDidUpdate();

        expect(instance.autofitContent).toHaveBeenCalled();
        expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
});
