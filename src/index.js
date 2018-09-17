import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import App from './App';

import 'antd/dist/antd.css';

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

// Initialize Firebase
var config = {
	apiKey: 'AIzaSyADV9YkHnk-YcF3Y1zw3Dv5bOQf8ZdDtcQ',
	authDomain: 'hmmreact.firebaseapp.com',
	databaseURL: 'https://hmmreact.firebaseio.com',
	projectId: 'hmmreact',
	storageBucket: 'hmmreact.appspot.com',
	messagingSenderId: '954285051531'
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
