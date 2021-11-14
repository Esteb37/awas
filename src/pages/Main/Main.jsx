import React from 'react';
import './Main.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import {
	HashRouter as Router,
	Switch,
	Route,
	useHistory,
} from 'react-router-dom';
import firebase from 'firebase/app';
import firebaseConfig from '../../resources/firebase-config';

import { FirestoreProvider } from '@react-firebase/firestore';
import { FirebaseAuthProvider } from '@react-firebase/auth';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Friends from './Friends/Friends';
import Faq from './Faq/Faq';
import { auth } from '../../resources/constants';

function Main() {
	const history = useHistory();
	React.useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (!user) {
				history.push('/login');
			}
		});
	}, []);
	return (
		<FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
			<FirestoreProvider firebase={firebase} {...firebaseConfig}>
				<Router>
					<Sidebar />
					<Switch>
						<Route path='/' exact component={Home} />
						<Route path='/profile' exact component={Profile} />
						<Route path='/friends' exact component={Friends} />
						<Route path='/faq' exact component={Faq} />
					</Switch>
				</Router>
			</FirestoreProvider>
		</FirebaseAuthProvider>
	);
}

export default Main;
