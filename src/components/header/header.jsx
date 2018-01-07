import { h, Component } from 'preact';
import classNames from 'classnames';

import arrowUpIcon from './icons/arrow-up-icon.svg';
import arrowDownIcon from './icons/arrow-down-icon.svg';
import style from './header.scss';

export default class Header extends Component {
    render() {
        return (
            <div className={style.header}>
                <img
                    className={classNames(style.icon, style.iconLeft)}
                    src={arrowUpIcon}
                />
                <div className={style.headerTitle}>Notes app</div>
                <img
                    className={classNames(style.icon, style.iconRight)}
                    src={arrowDownIcon}
                />
            </div>
        );
    }
}
