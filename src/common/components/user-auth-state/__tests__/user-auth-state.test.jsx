jest.mock('redux', () => ({
    bindActionCreators: jest.fn(actions => actions)
}));
jest.mock('react-redux', () => {
    const reactRedux = {
        connect: jest.fn((mapStateToProps, mapDispatchToProps) => {
            const state = {
                isLoggedIn: true,
                extraProperty: 'extraProperty'
            };

            // eslint-disable-next-line no-underscore-dangle
            reactRedux.connect._returnedValueOf = {
                mapStateToProps: mapStateToProps(state),
                mapDispatchToProps: mapDispatchToProps('dispatch')
            };

            return component => component;
        })
    };

    return reactRedux;
});
jest.mock('../../../hocs/with-redux-store', () => () => component => component);
// eslint-disable-next-line react/prop-types
jest.mock('../../button', () => ({ theme, children, onClick }) => (
    <button className={theme} onClick={onClick}>
        {children}
    </button>
));
jest.mock('../../../features/auth', () => ({
    authActions: {
        logoutRequest: jest.fn()
    },
    authSelectors: {
        getAuthState: jest.fn(state => state)
    }
}));

/* eslint-disable import/first */
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { authActions } from '../../../features/auth';
import UserAuthState from '../user-auth-state';
/* eslint-enable import/first */

describe('<UserAuthState />', () => {
    describe('renders correctly', () => {
        it('when isLoggedIn', () => {
            // eslint-disable-next-line no-shadow
            const authActions = {
                logoutRequest: jest.fn()
            };
            const tree = renderer
                .create(<UserAuthState isLoggedIn authActions={authActions} />)
                .toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('when NOT isLoggedIn', () => {
            // eslint-disable-next-line no-shadow
            const authActions = {
                logoutRequest: jest.fn()
            };
            const tree = renderer
                .create(
                    <UserAuthState
                        isLoggedIn={false}
                        authActions={authActions}
                    />
                )
                .toJSON();

            expect(tree).toMatchSnapshot();
        });
    });

    describe('redux connect', () => {
        it('should correctly use `bindActionCreators`', () => {
            expect(bindActionCreators).toHaveBeenCalledWith(
                authActions,
                'dispatch'
            );
        });

        it('should correctly implement `mapStateToProps` method', () => {
            // eslint-disable-next-line no-underscore-dangle
            expect(connect._returnedValueOf.mapStateToProps).toEqual({
                isLoggedIn: true
            });
        });

        it('should correctly implement `mapDispatchToProps` method', () => {
            // eslint-disable-next-line no-underscore-dangle
            expect(connect._returnedValueOf.mapDispatchToProps).toEqual({
                authActions
            });
        });
    });

    it('should invoke `logoutRequest()` after button click', () => {
        // eslint-disable-next-line no-shadow
        const authActions = {
            logoutRequest: jest.fn()
        };
        const wrapper = mount(
            <UserAuthState isLoggedIn authActions={authActions} />
        );

        wrapper.find('button').simulate('click');

        expect(authActions.logoutRequest).toHaveBeenCalled();
    });
});
