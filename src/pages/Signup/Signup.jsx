import React, { useEffect } from 'react';
import * as AiIcons from 'react-icons/ai';
import './Signup.css';
import { Link, useHistory } from 'react-router-dom';
//eslint-disable-next-line
import firebase from 'firebase/app';
import 'firebase/auth';

import $ from 'jquery';
import Header from '../../components/Header/Header';
import { auth, doc } from '../../resources/constants';
import { MdAddPhotoAlternate } from 'react-icons/md';

function Signup() {
	const [profilePicture, setProfilePicture] = React.useState(
		`url('./logos/awas.png')`
	);

	var authErrors = {
		'auth/email-already-exists': 'Este correo ya está registrado.',
		'auth/internal-error': 'Error interno.',
		'auth/invalid-email': 'El correo proporcionado es inválido.',
		'auth/invalid-password': 'La contraseña es inválida.',
		'auth/email-already-in-use': 'Este correo ya está registrado.',
	};

	const history = useHistory();

	const signUp = () => {
		auth
			.createUserWithEmailAndPassword($('#email').val(), $('#password').val())
			.then((userCredential) => {
				const user = userCredential.user;
				$('#signup-error').hide();
				user
					.updateProfile({
						displayName: $('#name').val(),
						phoneNumber: $('#phone').val(),
					})
					.then(() => {
						doc('users/' + user.uid)
							.set({
								name: $('#name').val(),
								phone: $('#phone').val(),
								email: $('#email').val(),
							})
							.then(() => {
								const storageRef = firebase.storage().ref();
								const file = $('#add-profile').prop('files')[0];

								if (file) {
									const pictureRef = storageRef.child(
										'profilePictures/' +
											user.uid +
											file.name.substr(file.name.lastIndexOf('.'))
									);

									pictureRef
										.put(file)
										.then(function (snapshot) {
											snapshot.ref.getDownloadURL().then((url) => {
												doc('users/' + user.uid).update({
													profilePicture: url,
												});
												history.push('/');
											});
										})
										.catch((error) => {
											setIsAddLoading(false);
											$('#add-error').html(
												authErrors[error.code]
													? authErrors[error.code]
													: error.message
											);
											$('#add-error').show();
										});
								} else {
									history.push('/');
								}
							});
					});
			})
			.catch((error) => {
				console.log(error);
				$('#signup-error').html(
					authErrors[error.code] ? authErrors[error.code] : error.message
				);
				$('#signup-error').show();
			});
	};

	useEffect(() => {
		const form = document.getElementById('signup-form');
		form.addEventListener(
			'submit',
			function (event) {
				$('#signup-error').hide();
				$('#min-chars').hide();
				$('#no-match').hide();
				if ($('#password').val()?.length < 6) {
					$('#min-chars').show();
				} else if (form.checkValidity()) {
					if ($('#password').val() !== $('#confirm').val()) {
						$('#no-match').show();
					} else {
						signUp();
					}
				}
				event.preventDefault();
				event.stopPropagation();
				form.classList.add('was-validated');
			},
			false
		);
	});

	const handleFileChange = (input) => {
		var file = input.files[0];
		var reader = new FileReader();
		var url = reader.readAsDataURL(file);

		reader.onloadend = function (e) {
			setProfilePicture(`url(${reader.result})`);
		}.bind(input);
	};

	return (
		<div className='signup'>
			<Header />
			<img className='signup-logo' alt='' />
			<h1>¡Bienvenido/a a Awas!</h1>
			<div
				className='add-profile-picture-holder'
				style={{ backgroundImage: profilePicture }}>
				<input
					type='file'
					accept='.png,.jpg'
					onChange={(event) => handleFileChange(event.target)}
					id='add-profile'
				/>
				<MdAddPhotoAlternate />
			</div>
			<form id='signup-form' className='needs-validation' noValidate>
				<div className='input-group mb-3'>
					<div className='input-group-prepend'>
						<span className='input-group-text' id='basic-addon1'>
							<AiIcons.AiOutlineUser />
						</span>
					</div>
					<input
						required
						type='text'
						className='form-control'
						autoComplete='name'
						placeholder='Nombre (s)'
						aria-label='Nombre (s)'
						aria-describedby='basic-addon1'
						name='name'
						id='name'
					/>
				</div>
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
						placeholder='Correo electrónico'
						aria-label='Correo electrónico'
						aria-describedby='basic-addon1'
						name='email'
						id='email'
					/>
				</div>
				<div className='input-group mb-3'>
					<div className='input-group-prepend'>
						<span className='input-group-text' id='basic-addon1'>
							<AiIcons.AiOutlinePhone />
						</span>
					</div>
					<input
						required
						type='tel'
						className='form-control'
						autoComplete='phone'
						placeholder='Número de teléfono'
						aria-label='Número de teléfono'
						aria-describedby='basic-addon1'
						name='phone'
						id='phone'
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
						minLength='6'
						id='password'
					/>
				</div>
				<div className='input-group mb-3'>
					<div className='input-group-prepend'>
						<span className='input-group-text' id='basic-addon2'>
							<AiIcons.AiFillLock />
						</span>
					</div>
					<input
						required
						type='password'
						className='form-control'
						autoComplete='off'
						placeholder='Confirmar contraseña'
						aria-label='Confirmar contraseña'
						aria-describedby='basic-addon2'
						name='confirm'
						minLength='6'
						id='confirm'
					/>
				</div>
				<div id='min-chars' className='invalid-feedback'>
					La contraseña debe tener mínimo 6 caracteres.
				</div>
				<div id='no-match' className='invalid-feedback'>
					Las contraseñas no coinciden.
				</div>
				<div id='signup-error' className='invalid-feedback'></div>
				<button className='btn btn-info' type='submit'>
					Continuar
				</button>
			</form>
			<Link className='link-register' to='/login'>
				¿Ya tienes una cuenta? <span>Inicia sesión.</span>
			</Link>
		</div>
	);
}

export default Signup;
