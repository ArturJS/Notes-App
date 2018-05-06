import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { childrenPropType } from '../../prop-types/components.prop-types';
import './button.scss';

export default class Button extends Component {
    static propTypes = {
        theme: PropTypes.oneOf(['primary', 'hot']),
        type: PropTypes.string,
        className: PropTypes.string,
        children: childrenPropType,
        onClick: PropTypes.func
    };

    static defaultProps = {
        children: null,
        theme: 'primary',
        type: 'button',
        className: '',
        onClick: _.noop
    };

    getThemeClass() {
        const { theme } = this.props;

        return `btn-${theme}`;
    }

    render() {
        const { children, className, type, onClick } = this.props;
        const themeClass = this.getThemeClass();

        return (
            <button
                type={type}
                className={classNames(
                    'btn btn-gradient-basis',
                    themeClass,
                    className
                )}
                onClick={onClick}
            >
                <span className="btn-content">{children}</span>
            </button>
        );
    }
}
