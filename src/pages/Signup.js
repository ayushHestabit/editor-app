import React from 'react';
import { TextInput, H2, Button } from '../components';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import apiRequest, { showToast } from '../Utilities';
import { AuthActions } from '../reducers/AuthReducer';
import { useForm, Controller } from 'react-hook-form';
import { Container } from '@mantine/core';

const Signup = () => {
	const {
		handleSubmit,
		control,
		formState: { isSubmitting, errors },
	} = useForm({ mode: 'onChange' });

	const dispatch = useDispatch();

	const signup = async (payload) => {
		try {
			const response = await apiRequest.post(`signup`, payload);
			dispatch(AuthActions.setAuth(response.data.data));
		} catch (error) {
			showToast(error?.response?.data?.message, 'error');
		}
	};

	return (
		<div className='flex-col min-h-screen flex'>
			<Container className='flex flex-col flex-1 justify-between w-full'>
				<div className='flex justify-center items-center flex-1'>
					<div className='w-full max-w-[460px] mx-auto bg-white p-6 rounded-xl shadow-md'>
						<H2 className>Sign Up</H2>
						<form onSubmit={handleSubmit((values) => signup(values))}>
							<Controller
								name="name"
								control={control}
								render={(field) => (
									<TextInput
										{...field}
										type="text"
										placeholder="Enter Your Name"
										errors={errors}
									/>
								)}
								rules={{
									required: 'Name is required.',
									maxLength: {
										value: 20,
										message: 'This input exceed maxLength.',
									},
								}}
							/>
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
							<Controller
								name="confirm_password"
								control={control}
								render={(field) => (
									<TextInput
										{...field}
										type="password"
										placeholder="Enter Your Confirm Password"
										errors={errors}
									/>
								)}
								rules={{
									required: 'Comfirm Password is required.',
								}}
							/>
							<Button
								className="btn btn-secondary text-white"
								type="submit"
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Submitting...' : 'Sign Up'}
							</Button>
							<div>
								Don&apos;t have an account?{' '}
								<Link to="/login">Login</Link>
							</div>
						</form>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Signup;