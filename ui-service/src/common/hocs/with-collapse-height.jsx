import React from 'react';
import { findDOMNode } from 'react-dom';
import { Transition } from 'react-transition-group';
import { sleep } from '@common/utils';
import { childrenPropType } from '@common/prop-types/components.prop-types';

const withCollapseHeight = (
    { duration } = { duration: 300 }
) => WrappedComponent => {
    const transition = `height ${duration}ms ease-out`;
    const applyStyles = ({ element, styles }) => {
        Object.entries(styles).forEach(([key, value]) => {
            element.style.setProperty(key, value);
        });
    };
    const initAnimation = async ({ element, height }) => {
        await sleep(0);
        element.style.setProperty('height', `${height}px`);

        await sleep(duration);
        element.style.setProperty('height', '');
        element.style.setProperty('transition', '');
        element.style.setProperty('overflow', '');
    };

    return class CollapseHeight extends React.Component {
        static propTypes = {
            children: childrenPropType.isRequired
        };

        handleEnter = () => {
            // eslint-disable-next-line react/no-find-dom-node
            const element = findDOMNode(this);
            const styles = {
                height: '0',
                overflow: 'hidden',
                transition
            };

            applyStyles({
                element,
                styles
            });
            initAnimation({
                element,
                height: element.scrollHeight
            });
        };

        handleExit = () => {
            // eslint-disable-next-line react/no-find-dom-node
            const element = findDOMNode(this);
            const styles = {
                height: `${element.scrollHeight}px`,
                overflow: 'hidden',
                transition
            };

            applyStyles({
                element,
                styles
            });
            initAnimation({
                element,
                height: 0
            });
        };

        render() {
            const { children, ...restProps } = this.props;

            return (
                <Transition
                    {...restProps}
                    timeout={300}
                    onEnter={this.handleEnter}
                    onExit={this.handleExit}
                    unmountOnExit
                >
                    <WrappedComponent>{children}</WrappedComponent>
                </Transition>
            );
        }
    };
};

export default withCollapseHeight;
