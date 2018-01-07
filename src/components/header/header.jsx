import { h, Component } from 'preact';

import arrowUpIcon from './icons/arrow-up-icon.svg';
import arrowDownIcon from './icons/arrow-down-icon.svg';
import style from './header.scss';

export default class Header extends Component {
    scrollTop = () => {
        window.scroll({ top: 0, behavior: 'smooth' });
    };

    scrollBottom = () => {
        window.scroll({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    render() {
        return (
            <div className={style.header}>
                <div className={style.headerContent}>
                    <img
                        className={style.icon}
                        src={arrowUpIcon}
                        onClick={this.scrollTop}
                    />
                    <div className={style.headerTitle}>Notes app</div>
                    <img
                        className={style.icon}
                        src={arrowDownIcon}
                        onClick={this.scrollBottom}
                    />
                </div>
            </div>
        );
    }
}
