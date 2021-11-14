import React from 'react';
import * as IoIcons from 'react-icons/io';

import { useHistory } from 'react-router-dom';

import './Header.css';
import '../../theme.css';
import { IconContext } from 'react-icons';

export default function Header(props) {
	const history = useHistory();

	const goBack = () => {
		props.back ? history.push(props.back) : history.goBack();
	};

	return (
		<>
			<IconContext.Provider value={{ color: 'var(--gold)' }}>
				<div className='header'>
					{!props.hide ? (
						<>
							<div onClick={goBack} className='header-back'>
								<IoIcons.IoIosArrowBack />
							</div>
							<img className='header-logo' src='./logos/side_white.png' />
						</>
					) : (
						''
					)}
				</div>
			</IconContext.Provider>
		</>
	);
}
