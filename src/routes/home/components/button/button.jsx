import { h, Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './button.scss';

export default class Button extends Component {
    static propTypes = {
        theme: PropTypes.oneOf(['Primary', 'Hot'])
    };

    static defaultProps = {
        children: null,
        theme: 'Primary'
    };

    getThemeClass() {
        const { theme } = this.props;
        return style[`btn${theme}`];
    }

    render() {
        const { children, class: otherClassNames, ...restProps } = this.props;
        const themeClass = this.getThemeClass();

        return (
            <button
                type="button"
                class={classNames(
                    style.btn,
                    style.btnGradientBasis,
                    themeClass,
                    ...otherClassNames
                )}
                {...restProps}>
                <span class={style.btnContent}>{children}</span>
            </button>
        );
    }
}
