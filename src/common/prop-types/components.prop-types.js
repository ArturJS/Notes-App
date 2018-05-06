import PropTypes from 'prop-types';

const singleChildrenPropType = PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.number,
    PropTypes.string,
    PropTypes.oneOf([null])
]);

export const childrenPropType = PropTypes.oneOfType([
    singleChildrenPropType,
    PropTypes.arrayOf(singleChildrenPropType)
]);
