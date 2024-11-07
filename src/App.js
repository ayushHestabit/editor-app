import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { MantineProvider, createTheme } from "@mantine/core";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { history } from './Utilities';
import { store, persistor } from './Store';

import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Editor from 'pages/Editor';
import '@mantine/core/styles.css';


const AuthRoute = ({ children }) => {
	const user = useSelector((state) => state.auth.user);
	return user !== null ? <Navigate to="/" /> : children;
};
AuthRoute.propTypes = {
	children: PropTypes.element,
};

const PrivateRoute = ({ children }) => {
	const user = useSelector((state) => state.auth.user);
	return user !== null ? children : <Navigate to={{ pathname: '/login' }} />;
};
PrivateRoute.propTypes = {
	children: PropTypes.element,
};

const AppRoutes = () => {
	return (
		<Router history={history}>
			<Routes>
				<Route
					exact={true}
					path="/"
					element={
						<PrivateRoute>
							<Editor />
						</PrivateRoute>
					}
				/>
				<Route
					exact={true}
					path="/login"
					element={
						<AuthRoute>
							<Login />
						</AuthRoute>
					}
				/>
				<Route
					exact={true}
					path="/signup"
					element={
						<AuthRoute>
							<Signup />
						</AuthRoute>
					}
				/>
				<Route exact={true} path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
};

const MantineTheme = createTheme({
	fontFamily: "Segoe UI Regular, san-serif",
	colors: {
		dark: [
			"#C9C9C9",
			"#b8b8b8",
			"#828282",
			"#696969",
			"#2E3235",
			"#41454B",
			"#2E2E2E",
			"#3E4344",
			"#474A51",
			"#141414",
		],
		blue: [
			"#E7EEF5",
			"#d0ebff",
			"#a5d8ff",
			"#74c0fc",
			"#4dabf7",
			"#339af0",
			"#228be6",
			"#1c7ed6",
			"#1971c2",
			"#1864ab",
		],
	},
});

const App = () => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<MantineProvider theme={MantineTheme}>
					<AppRoutes />
					<ToastContainer />
				</MantineProvider>
			</PersistGate>
		</Provider>
	);
};

export default App;
