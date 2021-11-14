import React from 'react';
import { Link } from 'react-router-dom';
import './Topbar.css';
import { TopbarData, TopbarAppointmentsData } from './TopbarData';
import $ from 'jquery';

const Topbar = (props) => {
	const selectItem = (e) => {
		$('.topbar-item').removeClass('selected');
		$(e.target).closest('.topbar-item').addClass('selected');
	};

	const type = props?.type;

	return (
		<>
			<div className='topbar'>
				<div className='topbar-menu'>
					{(type === 'appointments' ? TopbarAppointmentsData : TopbarData).map(
						(item, index) => {
							return (
								<div
									key={index}
									className={item.cname}
									id={'topbar-' + item.id}
									onClick={selectItem}>
									<Link to={item.path}>
										{item.icon}
										<h3>{item.title}</h3>
									</Link>
								</div>
							);
						}
					)}
				</div>
			</div>
		</>
	);
};

export default Topbar;
