import { h, Component } from 'preact';
import classNames from 'classnames';
import { Collapse } from 'react-collapse';

import './header.scss';

export default class Header extends Component {
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
            <div className={'header'}>
                <div className={'header-content-wrapper'}>
                    <div className={'header-content'}>
                        <i
                            className={'icon icon-arrow-up'}
                            onClick={this.scrollTop}
                        />
                        <i
                            className={'icon icon-arrow-down'}
                            onClick={this.scrollBottom}
                        />
                        <div className={'header-title'}>Notes app</div>
                        <div
                            className={classNames(
                                'hide-from-tablet',
                                'header-hamburger',
                                { active: isExpanded }
                            )}
                            onClick={this.toggleMenu}>
                            <div className={'header-hamburger-times'} />
                            <div className={'header-hamburger-line'} />
                        </div>
                    </div>
                    <Collapse className={'header-menu'} isOpened={isExpanded}>
                        <div className={'header-menu-content'}>{children}</div>
                    </Collapse>
                </div>
            </div>
        );
    }
}
