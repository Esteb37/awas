import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App/App';

import './theme.css';
import { HashRouter, Route } from 'react-router-dom';
import { createHashHistory } from 'history';

let history = createHashHistory();

const renderReactDom = () => {
	ReactDOM.render(
		<React.StrictMode>
			<HashRouter history={history}>
				<Route path='/' component={App} />
			</HashRouter>
		</React.StrictMode>,
		document.getElementById('root')
	);
};

if (window.cordova) {
	document.addEventListener(
		'deviceready',
		() => {
			renderReactDom();
		},
		false
	);
} else {
	renderReactDom();
}
