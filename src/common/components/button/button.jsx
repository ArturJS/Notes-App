import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './button.scss';

export default class Button extends Component {
    static propTypes = {
        theme: PropTypes.oneOf(['primary', 'hot']),
        type: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        children: null,
        theme: 'primary',
        type: 'button',
        className: ''
    };

    getThemeClass() {
        const { theme } = this.props;

        return `btn-${theme}`;
    }

    render() {
        const { children, className, type } = this.props;
        const themeClass = this.getThemeClass();

        return (
            <button
                type={type}
                className={classNames(
                    'btn btn-gradient-basis',
                    themeClass,
                    className
                )}>
                <span className={'btn-content'}>{children}</span>
            </button>
        );
    }
}
