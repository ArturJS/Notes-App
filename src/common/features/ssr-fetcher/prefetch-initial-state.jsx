import React, { Component } from 'react';
import PropTypes from 'prop-types';

const isServerSide = typeof window === 'undefined';

export const prefetchInitialState = ({
    key,
    fetcher,
    renderContent = false
}) => WrappedComponent =>
    class PrefetchInitialState extends Component {
        static contextTypes = {
            registerFetcher: PropTypes.func
        };

        componentWillMount() {
            if (this.context.registerFetcher) {
                this.context.registerFetcher({
                    key,
                    fetcher
                });
            }
        }

        render() {
            if (
                !renderContent &&
                isServerSide &&
                this.context.registerFetcher
            ) {
                return null;
            }

            return <WrappedComponent {...this.props} />;
        }
    };
