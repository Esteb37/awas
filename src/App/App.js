import React from 'react';

import './App.css';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import firebase from 'firebase/app';
import firebaseConfig from '../resources/firebase-config';

import { FirestoreProvider } from '@react-firebase/firestore';
import { FirebaseAuthProvider } from '@react-firebase/auth';

import Main from '../pages/Main/Main';

import '../resources/common';
import Signup from '../pages/Signup/Signup';
import Login from '../pages/Login/Login';
import { auth } from '../resources/constants';

function App(props) {
	return (
		<>
			<FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
				<FirestoreProvider firebase={firebase} {...firebaseConfig}>
					<Router>
						<Switch>
							<Route path='/' exact component={Main} />
							<Route path='/friends' exact component={Main} />
							<Route path='/profile' exact component={Main} />
							<Route path='/faq' exact component={Main} />
							<Route path='/signup' exact component={Signup} />
							<Route path='/login' exact component={Login} />
						</Switch>
					</Router>
				</FirestoreProvider>
			</FirebaseAuthProvider>
		</>
	);
}

export default App;
