import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { toClass } from 'recompose';
import _ from 'lodash';
import store, { getConfiguredStore } from '../store';

const isServer = typeof window === 'undefined';

const withReduxStore = ({
    getInitialReduxState = _.noop
} = {}) => WrappedComponent => {
    class EnhancedComponent extends React.Component {
        static async getInitialProps({ req }) {
            const { getInitialProps = _.noop } = WrappedComponent;
            const getInitialReduxStateImpl = isServer
                ? getInitialReduxState
                : _.noop;
            const [initialReduxState, initialProps] = await Promise.all([
                getInitialReduxStateImpl({ req }),
                getInitialProps()
            ]);

            return {
                __INITIAL_REDUX_STATE__: initialReduxState,
                ...initialProps
            };
        }

        static propTypes = {
            // eslint-disable-next-line react/forbid-prop-types
            __INITIAL_REDUX_STATE__: PropTypes.object
        };

        static defaultProps = {
            __INITIAL_REDUX_STATE__: null
        };

        getReduxStore = () => {
            const { __INITIAL_REDUX_STATE__ } = this.props;

            if (isServer && __INITIAL_REDUX_STATE__) {
                return getConfiguredStore(__INITIAL_REDUX_STATE__);
            }

            return store;
        };

        render() {
            const reduxStore = this.getReduxStore();

            return (
                <Provider store={reduxStore}>
                    <WrappedComponent {...this.props} />
                </Provider>
            );
        }
    }

    EnhancedComponent.displayName = `withReduxStore(${WrappedComponent.displayName ||
        WrappedComponent.name})`;

    return toClass(hoistNonReactStatics(EnhancedComponent, WrappedComponent));
};

export default withReduxStore;
