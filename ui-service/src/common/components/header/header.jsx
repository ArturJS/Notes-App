import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Collapse } from 'react-collapse';
import {
    compose,
    pure,
    withHandlers,
    withStateHandlers,
    toClass
} from 'recompose';
import { childrenPropType } from '../../prop-types/components.prop-types';
import './header.scss';

const enhance = compose(
    pure,
    withStateHandlers(
        {
            isExpanded: false
        },
        {
            toggleMenu: ({ isExpanded }) => () => ({
                isExpanded: !isExpanded
            })
        }
    ),
    withHandlers({
        scrollTop: () => () => {
            window.scroll({ top: 0, behavior: 'smooth' });
        },
        scrollBottom: () => () => {
            window.scroll({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    })
);

const Header = ({
    scrollTop,
    scrollBottom,
    toggleMenu,
    isExpanded,
    children
}) => (
    <div className="header">
        <div className="header-content-wrapper">
            <div className="header-content">
                <i
                    className="header-icon icon-arrow-up"
                    onClick={scrollTop}
                    onKeyPress={scrollTop}
                    role="button"
                    tabIndex="0"
                />
                <i
                    className="header-icon icon-arrow-down"
                    onClick={scrollBottom}
                    onKeyPress={scrollBottom}
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
                    onClick={toggleMenu}
                    onKeyPress={toggleMenu}
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

Header.propTypes = {
    scrollTop: PropTypes.func.isRequired,
    scrollBottom: PropTypes.func.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    children: childrenPropType
};

Header.defaultProps = {
    children: null
};

export const HeaderClass = toClass(Header);
export default enhance(HeaderClass);
