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

export const MAPS_API_KEY = 'AIzaSyDt8gYYrERuXtkK9KNsJraqXkMgB3csRW8';
