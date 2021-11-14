import React from 'react';

import FriendCard from '../../../components/FriendCard/FriendCard';
import { auth, collection, doc } from '../../../resources/constants';
import firebase from 'firebase/app';
import * as AiIcons from 'react-icons/ai';

import './Friends.css';
export default function Friends() {
	const [user, setUser] = React.useState(null);

	const [friends, setFriends] = React.useState(null);

	const [queriedUsers, setQueriedUsers] = React.useState(null);
	React.useEffect(() => {
		auth.onAuthStateChanged((user) => {
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

	const addFriend = (id) => {
		let friends = user.friends;
		if (!friends) friends = [];

		if (friends.indexOf(id) === -1) {
			friends.push(id);
		} else {
			friends.splice(friends.indexOf(id), 1);
		}

		doc('users/' + auth.currentUser.uid).update({ friends: friends });
	};
	const searchUser = (query) => {
		if (query.length) {
			collection('users')
				.where('name', '!=', user.name)
				.orderBy('name')
				.startAt(query)
				.endAt(query + '\uf8ff')
				.get()
				.then((result) => {
					setQueriedUsers(result.docs);
				});
		} else {
			setQueriedUsers(null);
		}
	};
	return (
		<div className='friends'>
			<h1> Tus contactos</h1>
			<div className='input-group mb-3'>
				<div className='input-group-prepend'>
					<span className='input-group-text' id='basic-addon1'>
						<AiIcons.AiOutlineSearch />
					</span>
				</div>
				<input
					required
					type='text'
					className='form-control'
					placeholder='Buscar amigos...'
					aria-describedby='basic-addon1'
					id='user-finder'
					onChange={(event) => {
						searchUser($(event.target).val());
					}}
				/>
			</div>
			{queriedUsers ? (
				<div className='queried-users'>
					{queriedUsers.map((contact, index) => {
						return (
							<div className='queried-user' key={index}>
								<div
									className='user-profile'
									style={{
										backgroundImage: `url(
												${contact.data().profilePicture})`,
									}}></div>
								<h2>{contact.data().name} </h2>
								<button
									className='btn btn-secondary'
									onClick={(event) => {
										addFriend(contact.id);
									}}>
									{!user.friends || user.friends.indexOf(contact.id) === -1
										? '+ Seguir'
										: 'Siguiendo'}
								</button>
							</div>
						);
					})}
				</div>
			) : (
				''
			)}
			<div className='friends-list'>
				{friends ? (
					friends.map((friend, index) => {
						return (
							<FriendCard key={index} user={user} friend={friend.data()} />
						);
					})
				) : (
					<h3 className='mt-5'>Aún no tienes contactos</h3>
				)}
			</div>
		</div>
	);
}
