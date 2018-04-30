import PropTypes from 'prop-types';

export const filePropType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    downloadPath: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired
}).isRequired;

export const notesListPropType = PropTypes.arrayOf(filePropType).isRequired;
