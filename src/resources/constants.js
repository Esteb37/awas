import firebase from 'firebase/app';

require('firebase/firestore');
require('firebase/auth');

export const db = firebase.firestore();

export const collection = (route) => {
	return db.collection(route);
};

export const doc = (route) => {
	return db.doc(route);
};

export const auth = firebase.auth();

export const VERSION = '1.0.1';

export const MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
