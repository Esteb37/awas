import firebase from 'firebase/app';
const firebaseConfig = {
	apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
	authDomain: 'hackatec-2021.firebaseapp.com',
	projectId: 'hackatec-2021',
	storageBucket: 'hackatec-2021.appspot.com',
	messagingSenderId: '767026615438',
	appId: '1:767026615438:web:1601a0d8f1561fe33fe5df',
};
firebase.initializeApp(firebaseConfig);

export default firebaseConfig;
