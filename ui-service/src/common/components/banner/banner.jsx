import React from 'react';
import PropTypes from 'prop-types';
import { pure, compose, toClass } from 'recompose';
import './banner.scss';

const enhance = compose(toClass, pure);

const Banner = ({ title, body }) => (
    <div className="banner">
        <h3 className="banner__title">{title}</h3>
        <p className="banner__body">{body}</p>
    </div>
);

Banner.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired
};

export default enhance(Banner);
