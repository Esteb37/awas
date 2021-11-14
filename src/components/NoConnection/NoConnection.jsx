import React from 'react';
import './NoConnection.css';
import * as MdIcons from 'react-icons/md';

export default function NoConnection() {
	return (
		<div className='no-connection'>
			<MdIcons.MdSignalCellularConnectedNoInternet0Bar></MdIcons.MdSignalCellularConnectedNoInternet0Bar>
			<h1>Revisa tu conexión a internet.</h1>
		</div>
	);
}
