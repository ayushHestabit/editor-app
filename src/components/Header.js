import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { AuthActions } from '../reducers/AuthReducer';
import { Exclaimation } from 'assets/icons/Exclaimation';
import { Vector } from 'assets/icons/Vector';
import { Clock } from 'assets/icons/Clock';
import { Notification } from 'assets/icons/Notification';

const Header = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);
	const logout = () => {
		dispatch(AuthActions.logout());
	};

	return (
		<HeaderWrapper>
			<div className="container mx-2">
				<Navbar>
					<Logo>
						<p>File Info</p>
						<span><Exclaimation /></span>
					</Logo>
					<ul>
						<li>
							<Vector />
						</li>
						<li>
							<Notification />
						</li>
						<li>
							<Clock />
						</li>
						{user !== null && (
							<>
								<li>
									<a
										onClick={logout}
										href="javaScript:void(0)"
									>
										Logout
									</a>
								</li>
							</>
						)}
					</ul>
				</Navbar>
			</div>
		</HeaderWrapper>
	);
};

export default Header;

const HeaderWrapper = styled.header`
    padding: 20px 0;
    background-color: #fff;
    width: 100%;
    border-top: 5px solid #4c84ff;
    box-shadow: 0 2px 10px 0 #00000017;
`;

const Logo = styled.div`
    flex: 6;
    width: 300px;
    display: flex;
    justify-content: flex-start;
`;

const Navbar = styled.nav`
    flex: 5;
    display: flex;
    justify-content: flex-end;
    padding: 0 25px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    ul {
        margin: 0;
        list-style-type: none;
        display: flex;
        align-items: center;
        li {
            margin-left: 30px;
        }
    }
`;
