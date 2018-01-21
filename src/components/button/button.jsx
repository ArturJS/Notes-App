import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './button.scss';

export default class Button extends Component {
    static propTypes = {
        theme: PropTypes.oneOf(['primary', 'hot'])
    };

    static defaultProps = {
        children: null,
        theme: 'primary'
    };

    getThemeClass() {
        const { theme } = this.props;
        return `btn-${theme}`;
    }

    render() {
        const {
            children,
            className: otherClassNames,
            ...restProps
        } = this.props;
        const themeClass = this.getThemeClass();

        return (
            <button
                type="button"
                class={classNames(
                    'btn btn-gradient-basis',
                    themeClass,
                    ...otherClassNames
                )}
                {...restProps}>
                <span class={'btn-content'}>{children}</span>
            </button>
        );
    }
}
