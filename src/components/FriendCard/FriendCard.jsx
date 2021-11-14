import React from 'react';
import { distance } from '../../resources/tools';
import './FriendCard.css';

export default function FriendCard(props) {
	const friend = props.friend;

	const user = props.user;

	return (
		<div>
			<div role='listitem' className='w-dyn-item'>
				<div className='div-block-2'>
					<img
						src={friend.profilePicture}
						loading='lazy'
						alt=''
						className='image-2'
					/>
					<div className='div-block-3'>
						<div className='text-block-4'>{friend.name}</div>
						{friend.position ? (
							<div className='text-block-5'>
								A {distance(user.position, friend.position).toFixed(2)} KM de ti
							</div>
						) : (
							''
						)}
					</div>
					<div className='form-block w-form'>
						<form
							id='email-form'
							name='email-form'
							data-name='Email Form'
							className='form'>
							{friend.health ? (
								<label
									className={
										friend.health === 'A salvo'
											? 'field-label safe'
											: 'field-label danger'
									}>
									{friend.health}
								</label>
							) : (
								<label className='field-label sin-reportar-label'>
									SIN REPORTAR
								</label>
							)}
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
