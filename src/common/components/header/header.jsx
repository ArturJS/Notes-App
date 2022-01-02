import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { Collapse } from 'react-collapse';
import { childrenPropType } from '../../prop-types/components.prop-types';

const Header = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleMenu = () => setIsExpanded((isExpanded) => !isExpanded);
    const { pathname } = useRouter();
    const scrollTop = () => {
        window.scroll({ top: 0, behavior: 'smooth' });
    };
    const scrollBottom = () => {
        window.scroll({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        setIsExpanded(false);
    }, [pathname]);

    return (
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
                <Collapse
                    theme={{ collapse: 'header-menu' }}
                    isOpened={isExpanded}
                >
                    <div className="header-menu-content">{children}</div>
                </Collapse>
            </div>
        </div>
    );
};

Header.propTypes = {
    children: childrenPropType
};

Header.defaultProps = {
    children: null
};

export default Header;
