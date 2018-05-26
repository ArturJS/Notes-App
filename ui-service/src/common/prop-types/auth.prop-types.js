import PropTypes from 'prop-types';

export const authActionsPropType = PropTypes.shape({
    loginRequest: PropTypes.func.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    loginFailure: PropTypes.func.isRequired,
    logoutRequest: PropTypes.func.isRequired,
    logoutSuccess: PropTypes.func.isRequired,
    logoutFailure: PropTypes.func.isRequired
});
