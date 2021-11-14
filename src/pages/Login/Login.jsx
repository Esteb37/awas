import React, { useEffect, useRef } from 'react';
import * as AiIcons from 'react-icons/ai';
import './Login.css';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import Header from '../../components/Header/Header';
import $ from 'jquery';
import Popup from 'reactjs-popup';
import { useHistory } from 'react-router-dom';
import { auth } from '../../resources/constants';

function Login() {
	const ref = useRef();

	var authErrors = {
		'auth/email-already-exists': 'Este correo ya está registrado.',
		'auth/internal-error': 'Error interno.',
		'auth/invalid-email': 'El correo proporcionado es inválido.',
		'auth/invalid-password': 'La contraseña es inválida.',
		'auth/wrong-password': 'Contraseña incorrecta o el usuario no existe',
		'auth/user-not-found': 'No se encontró el usuario.',
		'auth/network-request-failed': 'Revisa tu conexión a internet.',
	};

	const history = useHistory();

	const logIn = () => {
		auth
			.signInWithEmailAndPassword($('#email').val(), $('#password').val())
			.then((userCredential) => {
				history.push('/');
			})
			.catch((error) => {
				console.log(error);

				$('#signup-error').html(
					authErrors[error.code] ? authErrors[error.code] : error.message
				);
				$('#signup-error').addClass('shown');
			});
	};

	useEffect(() => {
		const form = document.getElementById('login-form');
		form.addEventListener(
			'submit',
			function (event) {
				event.preventDefault();
				event.stopPropagation();
				if (form.checkValidity()) {
					logIn();
				}
				form.classList.add('was-validated');
			},
			false
		);
	}, []);

	const loginWithGoogle = () => {
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

	return (
		<div className='login'>
			<Header hide={true} />
			<img className='login-logo' alt='' src='./logos/awas.png' />
			<form id='login-form' className='needs-validation' noValidate>
				<div className='input-group mb-3'>
					<div className='input-group-prepend'>
						<span className='input-group-text' id='basic-addon1'>
							<AiIcons.AiOutlineMail />
						</span>
					</div>
					<input
						required
						type='email'
						className='form-control'
						autoComplete='email'
						placeholder='Correo'
						aria-label='Correo'
						id='email'
						aria-describedby='basic-addon1'
						name='email'
					/>
				</div>
				<div className='input-group mb-3'>
					<div className='input-group-prepend'>
						<span className='input-group-text' id='basic-addon2'>
							<AiIcons.AiOutlineLock />
						</span>
					</div>
					<input
						required
						type='password'
						className='form-control'
						autoComplete='current-password'
						placeholder='Contraseña'
						aria-label='Contraseña'
						aria-describedby='basic-addon2'
						name='password'
						id='password'
					/>
				</div>
				<div className='form-check mb-2'>
					<input
						className='form-check-input btn-primary'
						type='checkbox'
						id='persist-auth'
					/>
					<label className='form-check-label' htmlFor='autoSizingCheck'>
						Mantener sesión iniciada.
					</label>
				</div>
				<div id='signup-error' className='invalid-feedback'></div>
				<button className='btn button-login btn-secondary' type='submit'>
					Ingresar
				</button>
				<div className='login-buttons'>
					<button
						onClick={loginWithGoogle}
						type='button'
						className='login-button login-button-access btn btn-outline-secondary'>
						<img src='./logos/google.png' alt='' /> Accede con Google
					</button>
				</div>
			</form>
			<Link className='link-register' to='/signup'>
				¿No tienes una cuenta? <span>Regístrate.</span>
			</Link>
		</div>
	);
}

export default Login;
