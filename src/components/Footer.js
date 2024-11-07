import React from 'react';
import styled from 'styled-components';

const Footer = () => {
	return (
		<FooterWrapper>
			<div className="container">
				<div className="row">
					<p style={{ marginLeft: '30px', marginRight: '30px' }}>
						<span style={{ textAlign: 'left', lineHeight: '60px' }}>
							©2021{' '}
							<a
								href="https://mernjs.github.io/create-mern-app"
								target="_blank"
								rel="noreferrer"
							>
								{' '}
								Margent
							</a>
						</span>
					</p>
				</div>
			</div>
		</FooterWrapper>
	);
};

export default Footer;

const FooterWrapper = styled.footer`
    background-color: #fff;
    width: 100%;
`;
