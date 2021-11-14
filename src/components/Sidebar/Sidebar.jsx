import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as ImIcons from 'react-icons/im';
import { Link, useHistory } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Sidebar.css';
import { IconContext } from 'react-icons';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import firebase from 'firebase/app';
import { collection, auth } from '../../resources/constants';

export default function Sidebar() {
	const [sidebar, setSidebar] = useState(false);

	const showSidebar = () => setSidebar(!sidebar);

	const history = useHistory();

	const signInWithEmail = () => {
		history.push('/login');
	};

	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth
			.signInWithRedirect(provider)
			.then(() => {
				return auth.getRedirectResult();
			})
			.then((result) => {
				if (auth.currentUser) {
					history.push('/');
				}
			})
			.catch((error) => {
				if (error.code === 'auth/network-request-failed') {
					alert('Revisa tu conexión a internet.');
				} else {
					alert(error.message);
				}
			});
	};

	const logOut = () => {
		auth
			.signOut()
			.then(() => {
				window.location.reload();
			})
			.catch((error) => {
				alert('Hubo un error cerrando tu sesión: ' + error.message);
			});
	};

	const users = collection('users');

	return (
		<>
			<FirebaseAuthConsumer>
				{({ isSignedIn, user, providerId }) => {
					if (isSignedIn) {
						users
							.doc(user.uid)
							.get()
							.then((result) => {
								if (!result.exists) {
									users.doc(user.uid).set({
										name: user.displayName,
										email: user.email,
										phone: user.phoneNumber,
									});
								}
							});
					}
					return (
						<div>
							<div className='sidebr'>
								<Link to='#' className='menu-bars'>
									<FaIcons.FaBars onClick={showSidebar} />
								</Link>
								<img
									className='sidebar-logo'
									alt=''
									src='./logos/side_white.png'
								/>
								<a href='tel:911' className='btn btn-danger sos'>
									<AiIcons.AiFillPhone />
								</a>
							</div>

							<nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
								<ul className='nav-menu-items' onClick={showSidebar}>
									<li className='sidebar-toggle'>
										<Link to='#' className='menu-bars'>
											<AiIcons.AiOutlineClose />
										</Link>
										<img
											className='menu-logo'
											alt='./logos/awas.png'
											src='./logos/awas.png'
										/>
									</li>
									{isSignedIn ? (
										<div>
											{SidebarData.map((item, index) => {
												return (
													<li key={index} className={item.cname}>
														<Link to={item.path}>
															{item.icon}
															<span>{item.title}</span>
														</Link>
													</li>
												);
											})}
											<a className='button-log-out' href='/' onClick={logOut}>
												<ImIcons.ImExit color='#AD9F9F' />
												<span>Cerrar sesión</span>
											</a>
										</div>
									) : (
										<div className='sidebar-login'>
											<button
												type='button'
												className='sidebar-button btn btn-secondary'
												onClick={signInWithEmail}>
												Accede a tu cuenta
											</button>
											<div className='separator'>
												<hr />
												<span>O</span>
												<hr />
											</div>

											<button
												onClick={signInWithGoogle}
												type='button'
												className='sidebar-button sidebar-button-access btn btn-secondary'>
												<img src='./logos/google.png' alt='' />
												<p>Accede con Google</p>
											</button>
										</div>
									)}
								</ul>
							</nav>
						</div>
					);
				}}
			</FirebaseAuthConsumer>
		</>
	);
}
