import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './multiline-input.scss';

export default class MultilineInput extends Component {
    static propTypes = {
        input: PropTypes.shape({
            onChange: PropTypes.func.isRequired,
            value: PropTypes.string.isRequired,
            className: PropTypes.string
        }).isRequired,
        className: PropTypes.string,
        placeholder: PropTypes.string
    };

    static defaultProps = {
        className: '',
        placeholder: ''
    };

    setTextareaRef = node => {
        this.textareaEl = node;
    };

    autofitContent = () => {
        window.requestAnimationFrame(() => {
            this.textareaEl.style.height = '0px';
            this.textareaEl.style.height = `${this.textareaEl.scrollHeight}px`;
        });
    };

    render() {
        const { input, className, placeholder } = this.props;
        const { onChange, value } = input;

        return (
            <textarea
                ref={this.setTextareaRef}
                className={classNames('multiline-input', className)}
                placeholder={placeholder}
                onChange={onChange}
                onInput={this.autofitContent}
                value={value}
            />
        );
    }
}
