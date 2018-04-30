import React, { Component } from 'react';
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
        // todo fix
        return (
            <button
                type="button"
                className={classNames('btn btn-gradient-basis', 'btn-primary')}>
                <span className={'btn-content'}>{this.props.children}</span>
            </button>
        );

        /* const {
            children,
            className: otherClassNames,
            ...restProps = {}
        } = this.props;
        const themeClass = this.getThemeClass();

        return (
            <button
                type="button"
                className={classNames(
                    'btn btn-gradient-basis',
                    themeClass,
                    ...otherClassNames
                )}
                {...restProps}>
                <span className={'btn-content'}>{children}</span>
            </button>
        ); */
    }
}
