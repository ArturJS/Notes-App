import React, { Component } from 'react';
import classNames from 'classnames';
import { Collapse } from 'react-collapse';
import { childrenPropType } from '../../prop-types/components.prop-types';
import './header.scss';

export default class Header extends Component {
    static propTypes = {
        children: childrenPropType
    };

    static defaultProps = {
        children: null
    };

    state = {
        isExpanded: false
    };

    scrollTop = () => {
        window.scroll({ top: 0, behavior: 'smooth' });
    };

    scrollBottom = () => {
        window.scroll({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    toggleMenu = () => {
        this.setState(({ isExpanded }) => ({
            isExpanded: !isExpanded
        }));
    };

    render() {
        const { children } = this.props;
        const { isExpanded } = this.state;

        return (
            <div className="header">
                <div className="header-content-wrapper">
                    <div className="header-content">
                        <i
                            className="header-icon icon-arrow-up"
                            onClick={this.scrollTop}
                            onKeyPress={this.scrollTop}
                            role="button"
                            tabIndex="0"
                        />
                        <i
                            className="header-icon icon-arrow-down"
                            onClick={this.scrollBottom}
                            onKeyPress={this.scrollBottom}
                            role="button"
                            tabIndex="0"
                        />
                        <div className="header-title">Notes app</div>
                        <div
                            className={classNames(
                                'hide-from-tablet',
                                'header-hamburger',
                                { active: isExpanded }
                            )}
                            onClick={this.toggleMenu}
                            onKeyPress={this.toggleMenu}
                            role="button"
                            tabIndex="0"
                        >
                            <div className="header-hamburger-times" />
                            <div className="header-hamburger-line" />
                        </div>
                    </div>
                    <Collapse className="header-menu" isOpened={isExpanded}>
                        <div className="header-menu-content">{children}</div>
                    </Collapse>
                </div>
            </div>
        );
    }
}
