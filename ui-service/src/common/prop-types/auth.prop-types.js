import PropTypes from 'prop-types';

export const authActionsPropType = PropTypes.shape({
    loginRequest: PropTypes.func.isRequired,
    logoutRequest: PropTypes.func.isRequired
});
