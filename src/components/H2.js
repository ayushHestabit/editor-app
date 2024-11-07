import React from 'react';
import PropTypes from 'prop-types';

const Heading = (props) => {
	return <h2 className={`text-2xl font-bold leading-10 text-center mb-5 ${props.className}`}>{props.children}</h2>;
};

Heading.propTypes = {
	children: PropTypes.element,
};

export default Heading;