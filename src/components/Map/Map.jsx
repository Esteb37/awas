import React, { useRef } from 'react';
import './Map.css';

import {
	GoogleMap,
	InfoBox,
	LoadScript,
	Circle,
	DirectionsService,
	DirectionsRenderer,
} from '@react-google-maps/api';
import Popup from 'reactjs-popup';
import { auth, collection, doc, MAPS_API_KEY } from '../../resources/constants';
import firebase from 'firebase';
import { FaPhoneAlt } from 'react-icons/fa';
import { distance } from '../../resources/tools';

const containerStyle = {
	width: '100%',
	height: '100%',
};

const options = { closeBoxURL: '', enableEventPropagation: true };

const circleOptions = {
	strokeColor: 'green',
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: 'green',
	fillOpacity: 0.35,
	zIndex: 1,
};

const circleOptionsDanger = {
	strokeColor: '#FF0000',
	strokeOpacity: 0.8,
	strokeWeight: 2,
	fillColor: '#FF0000',
	fillOpacity: 0.35,
	zIndex: 1,
};

const onLoad = (infoBox) => {};

export default function Map() {
	const ref = useRef();

	const [center, setCenter] = React.useState(null);

	const [events, setEvents] = React.useState(null);

	const [user, setUser] = React.useState(null);

	const [friends, setFriends] = React.useState(null);

	const [refuges, setRefuges] = React.useState(null);

	const [origin, setOrigin] = React.useState(null);
	const [destination, setDestination] = React.useState(null);
	const [response, setResponse] = React.useState(null);

	const [filterFriends, setFilterFriends] = React.useState(true);
	const [filterEvents, setFilterEvents] = React.useState(true);
	const [filterRefuges, setFilterRefuges] = React.useState(true);

	const [inDanger, setInDanger] = React.useState(false);

	React.useEffect(() => {
		collection('refuges').onSnapshot((result) => {
			setRefuges(result.docs);
		});

		auth.onAuthStateChanged((user) => {
			navigator.geolocation.getCurrentPosition(function (position) {
				setCenter({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});

				setOrigin({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});

				doc('users/' + auth?.currentUser?.uid).update({
					position: new firebase.firestore.GeoPoint(
						position.coords.latitude,
						position.coords.longitude
					),
				});

				collection('events').onSnapshot((result) => {
					setEvents(result.docs);

					var dangerFlag = false;

					result.docs.forEach((evnt) => {
						let danger = isInRadius(
							new firebase.firestore.GeoPoint(
								position.coords.latitude,
								position.coords.longitude
							),
							evnt.data()
						);

						if (danger) dangerFlag = true;
					});
					doc('users/' + auth?.currentUser?.uid).update({
						health: !dangerFlag ? 'A salvo' : 'En peligro',
					});
					setInDanger(dangerFlag);
				});
			});

			doc('users/' + auth?.currentUser?.uid).onSnapshot((result) => {
				if (result.exists) {
					setUser(result.data());

					if (result.data().friends?.length) {
						collection('users')
							.where(
								firebase.firestore.FieldPath.documentId(),
								'in',
								result.data().friends
							)
							.onSnapshot((friends) => {
								setFriends(friends.docs);
							});
					}
				}
			});
		});
	}, []);

	const isInRadius = (current, evnt) => {
		let d = distance(current, evnt.position);

		return d <= evnt.size;
	};

	const selectFilter = (item, filter) => {
		$(item).toggleClass('selected');
		if (filter === 'friends') {
			setFilterFriends(!filterFriends);
		} else if (filter === 'events') {
			setFilterEvents(!filterEvents);
		} else if (filter === 'refuges') {
			setFilterRefuges(!filterRefuges);
		}
	};

	const directionsCallback = (response) => {
		console.log(response);

		if (response !== null) {
			if (response.status === 'OK') {
				setResponse(response);
			} else {
				console.log('response: ', response);
			}
		}
	};

	const getDirections = (position) => {
		setDestination({
			lat: position._lat,
			lng: position._long,
		});
		ref.current.close();
	};

	return (
		<div className='map'>
			<h1 className='danger-banner'>
				Peligro:{' '}
				<span className={inDanger ? 'danger' : 'safe'}>
					{inDanger ? 'Alto' : 'Bajo'}
				</span>
			</h1>
			<div className='map-buttons'>
				<button
					className='map-button btn btn-secondary selected'
					onClick={(event) => selectFilter(event.target, 'events')}>
					Eventos
				</button>
				<button
					className='map-button btn btn-secondary selected'
					onClick={(event) => selectFilter(event.target, 'friends')}>
					Amigos
				</button>
				<button
					className='map-button btn btn-secondary selected'
					onClick={(event) => selectFilter(event.target, 'refuges')}>
					Refugios
				</button>
			</div>
			<div className='map-container'>
				{center && user ? (
					<LoadScript googleMapsApiKey={MAPS_API_KEY}>
						<GoogleMap
							mapContainerStyle={containerStyle}
							center={center}
							zoom={10}>
							{destination && origin && (
								<DirectionsService
									// required
									options={{
										destination: destination,
										origin: origin,
										travelMode: 'DRIVING',
									}}
									// required
									callback={directionsCallback}
									// optional
									onLoad={(directionsService) => {
										console.log(
											'DirectionsService onLoad directionsService: ',
											directionsService
										);
									}}
									// optional
									onUnmount={(directionsService) => {
										console.log(
											'DirectionsService onUnmount directionsService: ',
											directionsService
										);
									}}
								/>
							)}

							{response !== null && (
								<DirectionsRenderer
									// required
									options={{
										directions: response,
									}}
									// optional
									onLoad={(directionsRenderer) => {
										console.log(
											'DirectionsRenderer onLoad directionsRenderer: ',
											directionsRenderer
										);
									}}
									// optional
									onUnmount={(directionsRenderer) => {
										console.log(
											'DirectionsRenderer onUnmount directionsRenderer: ',
											directionsRenderer
										);
									}}
								/>
							)}

							<InfoBox onLoad={onLoad} options={options} position={center}>
								<div
									className='user-marker'
									style={{
										backgroundImage: `url(
												${user.profilePicture})`,
									}}></div>
							</InfoBox>
							{events && filterEvents
								? events.map((evnt, index) => {
										let position = evnt.data().position;

										return (
											<div key={index}>
												<Circle
													center={{ lat: position._lat, lng: position._long }}
													radius={evnt.data().size * 1000}
													options={
														isInRadius(user.position, evnt.data())
															? circleOptionsDanger
															: circleOptions
													}></Circle>
												<InfoBox
													onLoad={onLoad}
													options={options}
													position={{
														lat: position._lat,
														lng: position._long,
													}}>
													<Popup
														ref={ref}
														className='refuge-popup'
														key={index}
														modal
														trigger={
															<div
																className='event-marker'
																style={{
																	backgroundImage: `url(
												${'./icons/' + evnt.data().type + '.png'})`,
																}}></div>
														}>
														<div>
															<div
																className='event-popup'
																style={{
																	backgroundImage: `url(
												${'./icons/' + evnt.data().type + '.png'})`,
																}}></div>
															<h1>
																{evnt.data().position._lat.toFixed(2)},{' '}
																{evnt.data().position._long.toFixed(2)}
															</h1>
															<h1>Radio: {evnt.data().size} km</h1>
														</div>
													</Popup>
												</InfoBox>
											</div>
										);
								  })
								: ''}
							{friends && filterFriends
								? friends.map((friend, index) => {
										let position = friend.data().position;
										if (position)
											return (
												<InfoBox
													key={index}
													onLoad={onLoad}
													options={options}
													position={{
														lat: position._lat,
														lng: position._long,
													}}>
													<Popup
														ref={ref}
														className='refuge-popup'
														key={index}
														modal
														trigger={
															<div
																className='user-marker'
																style={{
																	backgroundImage: `url(
												${friend.data().profilePicture})`,
																}}></div>
														}>
														<div>
															<div
																className='user-popup'
																style={{
																	backgroundImage: `url(
												${friend.data().profilePicture})`,
																}}></div>
															<h1>{friend.data().name}</h1>
															<h1
																className={
																	friend.data().health === 'A salvo'
																		? 'status safe'
																		: 'status danger'
																}>
																{friend.data().health}
															</h1>
															<h2>
																{position._lat.toFixed(2)} ,{' '}
																{position._long.toFixed(2)}
															</h2>
															<button
																className='btn btn-secondary'
																onClick={() => {
																	getDirections(position);
																}}>
																Direcciones
															</button>

															<a
																href={'tel:' + friend.data().phone}
																className='btn btn-primary'>
																<FaPhoneAlt />
																Llamar
															</a>
														</div>
													</Popup>
												</InfoBox>
											);
								  })
								: ''}

							{refuges && filterRefuges
								? refuges.map((refuge, index) => {
										refuge = refuge.data();
										let position = refuge.position;

										return (
											<InfoBox
												key={index}
												onLoad={onLoad}
												options={options}
												position={{ lat: position._lat, lng: position._long }}>
												<Popup
													ref={ref}
													className='refuge-popup'
													trigger={
														<div
															className='event-marker'
															onClick={() => {
																alert('clicked');
															}}
															style={{
																backgroundImage: `url(
												${'./icons/refuge.png'})`,
															}}></div>
													}
													modal>
													<div>
														<h1>{refuge.name}</h1>
														<h2>{refuge.direction}</h2>
														<button
															className='btn btn-primary'
															onClick={() => {
																getDirections(position);
															}}>
															Direcciones
														</button>
													</div>
												</Popup>
											</InfoBox>
										);
								  })
								: ''}
						</GoogleMap>
					</LoadScript>
				) : (
					''
				)}
			</div>
		</div>
	);
}
