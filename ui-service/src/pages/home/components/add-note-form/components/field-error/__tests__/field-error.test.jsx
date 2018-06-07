jest.mock('react-final-form', () => ({
    Field: props => JSON.stringify(props, null, '    ')
}));

/* eslint-disable import/first */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import FieldError, { FieldErrorClass } from '../field-error.jsx';
/* eslint-enable import/first */

describe('<FieldError />', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<FieldError name="testField" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    describe('`renderError` method', () => {
        // idea taken from https://github.com/acdlite/recompose/issues/407
        it('renders error if has touched && error', () => {
            const wrapper = mount(<FieldError name="testField" />);
            const { renderError } = wrapper.find(FieldErrorClass).props();
            const tree = renderer
                .create(
                    renderError({
                        meta: {
                            touched: true,
                            error: true
                        }
                    })
                )
                .toJSON();
            expect(tree).toMatchSnapshot();
        });

        it('renders nothing if has no error', () => {
            const wrapper = mount(<FieldError name="testField" />);
            const { renderError } = wrapper.find(FieldErrorClass).props();
            const tree = renderer
                .create(
                    renderError({
                        meta: {
                            touched: true,
                            error: false
                        }
                    })
                )
                .toJSON();
            expect(tree).toMatchSnapshot();
        });
    });
});
