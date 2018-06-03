import React from 'react';
import withCollapseHeight from '@common/hocs/with-collapse-height';
import { childrenPropType } from '@common/prop-types/components.prop-types';

const AnimateHeight = ({ children, ...restProps }) => (
    <div {...restProps}>{children}</div>
);

AnimateHeight.propTypes = {
    children: childrenPropType.isRequired
};

export default withCollapseHeight()(AnimateHeight);
