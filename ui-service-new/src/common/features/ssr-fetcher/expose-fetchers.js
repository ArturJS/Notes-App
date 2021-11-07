import { Component } from 'preact';
import PropTypes from 'prop-types';

export default class ExposeFetchers extends Component {
    static propTypes = {
        onRegisterFetcher: PropTypes.func.isRequired,
        children: PropTypes.arrayOf(PropTypes.node.isRequired).isRequired
    };

    static childContextTypes = {
        onRegisterFetcher: PropTypes.func.isRequired
    };

    getChildContext() {
        return {
            registerFetcher: this.props.onRegisterFetcher
        };
    }

    render() {
        return this.props.children[0];
    }
}
