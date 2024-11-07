import React from 'react';
import Header from '../components/Header';
import { Container } from '@mantine/core';

const NotFound = () => {
	return (
		<div className='flex-col min-h-screen flex'>
			<Header />
			<Container className='flex flex-col flex-1 justify-between w-full'>
				<div className='flex justify-center items-center flex-1'>
					<div className='w-full max-w-[460px] mx-auto bg-white p-6 rounded-xl shadow-md'>
						<h1>404 - Page Not Found</h1>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default NotFound;