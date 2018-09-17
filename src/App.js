import React, { Component, Fragment } from 'react';
import './App.css';
import Background from './assets/img/AppBG.png';

import { Row, Col, Icon, message } from 'antd';

import Header from './Screens/Header';
import Login from './Screens/Login';
import Register from './Screens/Register';

import QuizList from './Components/QuizList';
import QuizSubList from './Components/QuizSubList';
import Questions from './Components/Questions';
import Result from './Components/Result';

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

class App extends Component {
	constructor(props) {
		super(props);

		const currentPage = localStorage.getItem('currentPage') || 'home';
		const quizIndex = localStorage.getItem('quizIndex') || '';
		const disabled = localStorage.getItem('disabled') || false;
		const currentQuiz = JSON.parse(localStorage.getItem('currentQuiz')) || {};
		const quizKey = localStorage.getItem('quizKey') || '';
		const totalQues = JSON.parse(localStorage.getItem('totalQues')) || {};
		// JSON.parse( localStorage.getItem('quizIndex') )

		this.state = {
			currentPage, // home, login, register, quizList, startQuiz, Result
			loader: true,
			user: false,
			admin: false,
			quizIndex,
			disabled: this.str2bool(disabled),
			currentQuiz,
			quizKey,
			totalQues,

			quizes: '',
			quizesCat: '',
			takenQuiz: '',
			userToShow: ''
		};
	}

	str2bool(strvalue) {
		return strvalue && typeof strvalue === 'string'
			? strvalue.toLowerCase() === 'true' || strvalue === '1'
			: strvalue === true;
	}

	componentDidMount() {
		let iUID;

		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				iUID = user.uid;
				firebase
					.database()
					.ref('App/users/' + iUID)
					.on('value', snap => {
						const userData = snap.val();
						this.setState({
							user: { id: iUID, name: userData.name, email: userData.email },
							admin: userData.admin
						});
						if (this.state.currentPage === 'login' || this.state.currentPage === 'register')
							this.setValue('currentPage', 'home');

						this.setState({ loader: false });
						// console.clear();
					});
				firebase
					.database()
					.ref('App/TakenQuiz/' + iUID)
					.on('value', snap => {
						console.log(snap.val());
						this.setState({ takenQuiz: snap.val() });
					});
			} else {
				this.setState({ loader: false });
				console.log('user not signed in...');
				return;
			}
		});

		firebase
			.database()
			.ref('App/QuizList')
			.once('value', snap => {
				this.setState({
					quizesCat: Object.keys(snap.val()),
					quizes: snap.val()
				});
			});
	}

	setValue = (theState, theValue) => {
		if (typeof theValue === 'object') localStorage.setItem(theState, JSON.stringify(theValue));
		else localStorage.setItem(theState, theValue);

		this.setState({ [theState]: theValue });
		console.log('theState**', theState);
		console.log('theValue**', theValue);
	};

	logout = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				this.setState({ admin: false, user: false });
				localStorage.clear();
				this.showPage('login');
			})
			.catch(err => {
				console.log(err);
			});
	};

	showPage = targetPage => this.setValue('currentPage', targetPage);

	QuizList = quizIndex => {
		this.setValue('currentPage', 'quizList');
		this.setValue('quizIndex', quizIndex);
	};

	startQuiz = (cat, subCat, key, passing) => {
		this.setValue('disabled', true);
		this.setValue('currentQuiz', { cat, subCat, key, passing });

		firebase
			.database()
			.ref('App/QuizQs/' + cat + '/' + subCat)
			.once('value', snap => {
				if (!snap.exists()) {
					message.info('No Questions Available...');
					this.setValue('disabled', false);
					return;
				}

				this.setValue('disabled', false);
				this.setValue('currentPage', 'startQuiz');
				this.setValue('quizKey', key);

				const data = snap.val();
				let x = Object.keys(data);
				let y = x.map(iKey => {
					return data[iKey];
				});
				this.setValue('totalQues', y);
			});
	};

	showResult = (correctAns, percentage) => {
		const { currentQuiz, user } = this.state;

		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1;
		let yyyy = today.getFullYear();

		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;

		today = mm + '/' + dd + '/' + yyyy;

		firebase
			.database()
			.ref('App/TakenQuiz/' + user.id + '/' + currentQuiz.cat + '/' + [currentQuiz.subCat])
			.update({
				marks: Number(percentage),
				date: today
			})
			.then(() => {
				currentQuiz.correctAns = correctAns;
				currentQuiz.percentage = percentage;
				this.setValue('currentQuiz', currentQuiz);
				this.setValue('currentPage', 'Result');
			});
	};

	render() {
		const {
			loader,
			currentPage,
			user,
			quizesCat,
			quizes,
			quizIndex,
			takenQuiz,
			disabled,
			quizKey,
			totalQues,
			currentQuiz
		} = this.state;

		return (
			<Fragment>
				{loader && (
					<div className="loader">
						<Icon type="loading" style={{ fontSize: '36px', color: 'white' }} />
					</div>
				)}

				<div
					style={{ background: `url(${Background})`, padding: '70px 30px 50px', minHeight: '100%' }}
				>
					<Header logout={this.logout} user={user} showPage={this.showPage} />

					<Row gutter={16} type="flex" justify="center" align="center">
						<Col xs={24} sm={12} lg={6}>
							{!user &&
								(currentPage !== 'register' || currentPage === 'login') && (
									<Login showPage={this.showPage} />
								)}

							{!user &&
								currentPage === 'register' && (
									<Register handleLogin={this.logout} showPage={this.showPage} />
								)}
						</Col>
					</Row>

					{user &&
						currentPage === 'home' && <QuizList quizesCat={quizesCat} QuizList={this.QuizList} />}

					{user &&
						currentPage === 'quizList' && (
							<QuizSubList
								quizesCat={quizesCat}
								quizIndex={quizIndex}
								quizes={quizes}
								takenQuiz={takenQuiz}
								startQuiz={this.startQuiz}
								disabled={disabled}
							/>
						)}

					{user &&
						(currentPage === 'startQuiz' && quizKey) && (
							<Questions quizKey={quizKey} totalQues={totalQues} showResult={this.showResult} />
						)}

					{user &&
						currentPage === 'Result' && (
							<Result currentQuiz={currentQuiz} showPage={this.showPage} />
						)}
				</div>

				<footer>
					<Row>
						<Col span={24}>Muhammad Ovi</Col>
					</Row>
				</footer>
			</Fragment>
		);
	}
}

export default App;
