import React from 'react';
import { auth, doc } from '../../../resources/constants';
import './Profile.css';
import firebase from 'firebase/app';

export default function Profile() {
	const [user, setUser] = React.useState(null);

	React.useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				doc('users/' + user.uid).onSnapshot((result) => {
					setUser(result.data());
				});
			}
		});
	}, []);

	const updateHealth = (val) => {
		if (val !== 'Seleccionar') {
			doc('users/' + auth.currentUser.uid).update({ health: val });
		}
	};

	const updateLocation = () => {
		try {
			const position = new firebase.firestore.GeoPoint(
				parseFloat($('#lat').val()),
				parseFloat($('#long').val())
			);

			if (position) {
				doc('users/' + auth.currentUser.uid).update({ position: position });
			}
		} catch (e) {}
	};
	return (
		<div className='profile'>
			<h1>Mi Estado</h1>

			{user ? (
				<>
					<div
						className='profile-picture'
						style={{ backgroundImage: `url(${user.profilePicture})` }}></div>
					<h2>{user.name}</h2>
					<h4>
						{user.position._lat.toFixed(2)}, {user.position._long.toFixed(2)}
					</h4>
					<h3 className={user.health === 'A salvo' ? 'safe' : 'danger'}>
						{user.health}
					</h3>

					<h4>Reporta tu estado de salud</h4>
					<select
						className='btn btn-outline-secondary'
						onChange={(event) => updateHealth($(event.target).val())}>
						<option val='null'>Seleccionar</option>
						<option val='A salvo'>A salvo</option>
						<option val='En peligro'>En peligro</option>
						<option val='Herido/a'>Herido/a</option>
					</select>

					<h4>Actualiza tu ubicación</h4>
					<div className='update-location'>
						<input
							className='form-control btn btn-outline-secondary'
							type='number'
							id='lat'
							placeholder='Latitud'
							defaultValue={user.position._lat.toFixed(2)}
							onChange={() => updateLocation()}
						/>{' '}
						<h4 className='mr-4'>Lat</h4>
						<input
							className='form-control btn btn-outline-secondary'
							type='number'
							id='long'
							placeholder='Longitud'
							defaultValue={user.position._long.toFixed(2)}
							onChange={() => updateLocation()}
						/>
						<h4>Long</h4>
					</div>
				</>
			) : (
				''
			)}
		</div>
	);
}
