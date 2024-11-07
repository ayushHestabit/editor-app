import React from 'react';
import { Header, Footer, TextInput, H2, Button } from '../components';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import apiRequest, { showToast } from '../Utilities';
import { AuthActions } from '../reducers/AuthReducer';
import { useForm, Controller } from 'react-hook-form';
import { Container } from '@mantine/core';

const Login = () => {
	const {
		handleSubmit,
		control,
		formState: { isSubmitting, errors },
	} = useForm({ mode: 'onChange' });

	const dispatch = useDispatch();

	const login = async (payload) => {
		try {
			// const response = await apiRequest.post(`login`, payload);
			dispatch(AuthActions.setAuth(payload));
		} catch (error) {
			showToast(error?.response?.data?.message, 'error');
		}
	};

	return (
		<div className='flex-col min-h-screen flex'>
			<Container className='flex flex-col flex-1 justify-between w-full'>
				<div className='flex justify-center items-center flex-1'>
					<div className='w-full max-w-[460px] mx-auto bg-white p-6 rounded-xl shadow-md'>
						<H2 className>Sign In</H2>
						<form onSubmit={handleSubmit((values) => login(values))}>
							<Controller
								name="email"
								control={control}
								render={(field) => (
									<TextInput
										{...field}
										type="text"
										placeholder="Enter Your Email"
										errors={errors}
									/>
								)}
								rules={{ required: 'Email is required.' }}
							/>
							<Controller
								name="password"
								control={control}
								render={(field) => (
									<TextInput
										{...field}
										type="password"
										placeholder="Enter Your Password"
										errors={errors}
									/>
								)}
								rules={{ required: 'Password is required.' }}
							/>
							<Button
								disabled={isSubmitting}
								className="btn btn-secondary text-white"
								type="submit"
							>
								{isSubmitting ? 'Submitting...' : 'Log In'}
							</Button>
							<div className='text-center'>
								Don&apos;t have an account?{' '}
								<Link to="/signup" className='underline'> Signup</Link>
							</div>
						</form>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Login;
