import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class MultilineInput extends Component {
    static propTypes = {
        input: PropTypes.shape({
            onChange: PropTypes.func.isRequired,
            value: PropTypes.string.isRequired
        }).isRequired,
        className: PropTypes.string,
        placeholder: PropTypes.string
    };

    static defaultProps = {
        className: '',
        placeholder: ''
    };

    componentDidMount() {
        this.autofitContent();
    }

    componentDidUpdate() {
        this.autofitContent();
    }

    textareaRef = createRef();

    autofitContent = () => {
        window.requestAnimationFrame(() => {
            const { current: textareaEl } = this.textareaRef;

            if (!textareaEl) {
                return; // in case of unit tests
            }

            textareaEl.style.height = '0px';
            textareaEl.style.height = `${textareaEl.scrollHeight}px`;
        });
    };

    render() {
        const { input, className, placeholder } = this.props;

        return (
            <textarea
                ref={this.textareaRef}
                className={classNames('multiline-input', className)}
                placeholder={placeholder}
                onInput={this.autofitContent}
                {...input}
            />
        );
    }
}
