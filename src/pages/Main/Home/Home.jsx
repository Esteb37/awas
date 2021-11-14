import React from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import Map from '../../../components/Map/Map';

function Home() {
	const render = (status) => {
		return <h1>{status}</h1>;
	};

	return (
		<div className='home'>
			<Map />
		</div>
	);
}

export default Home;
