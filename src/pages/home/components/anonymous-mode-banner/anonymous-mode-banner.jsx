import React from 'react';
import PropTypes from 'prop-types';
import { pure, compose, toClass } from 'recompose';
import { connect } from 'react-redux';
import { authSelectors } from '@common/features/auth';
import Banner from '@common/components/banner';

const mapStateToProps = state => ({
    isLoggedIn: authSelectors.isLoggedIn(state)
});

const enhance = compose(toClass, connect(mapStateToProps, null), pure);

const AnonymousModeBanner = ({ isLoggedIn }) =>
    isLoggedIn ? null : (
        <Banner
            title="Anonymous mode"
            body={[
                'Take into account that all information ',
                'entered when you are not logged in will be stored ',
                'in browser storage and will be available ',
                'for anyone who has access to this browser.'
            ].join('')}
        />
    );

AnonymousModeBanner.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired
};

export default enhance(AnonymousModeBanner);
