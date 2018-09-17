import React, { Component, Fragment } from 'react';

import { Card, Icon, Button, message, Row, Col, Radio, Divider } from 'antd';

import QuizKey from '../QuizKey';

const RadioGroup = Radio.Group;
const radioStyle = { display: 'block', height: '30px', lineHeight: '30px' };

class Questions extends Component {
	constructor(props) {
		super(props);

		const userQuizKey = localStorage.getItem('userQuizKey') || '';
		const currentQues = localStorage.getItem('currentQues') || 0;
		const userAns = JSON.parse(localStorage.getItem('userAns')) || [];

		this.state = {
			userQuizKey,
			currentQues,
			userAns,
			value: '',
			disabled: true
		};
	}

	setKey = keyToSet => this.setValue('userQuizKey', keyToSet);

	setValue = (theState, theValue) => {
		if (typeof theValue === 'object')
			localStorage.setItem(theState, JSON.stringify(theValue));
		else localStorage.setItem(theState, theValue);

		this.setState({ [theState]: theValue });
		console.log('theState**', theState);
		console.log('theValue**', theValue);
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (values.key === this.props.quizKey) message.success('Correct');
				else message.error('Incorrect Password!');
			}
		});
	};

	onChange = e => {
		console.log('radio checked', e.target.value);
		if (e.target.value)
			this.setState({ value: e.target.value, disabled: false });
	};

	saveAns = () => {
		const { value, currentQues, userAns } = this.state;
		if (value) {
			userAns.push(value);

			this.setValue('currentQues', +currentQues + 1);
			this.setValue('userAns', userAns);

			this.setState({
				value: '',
				disabled: true
			});
		}
	};

	calcResult = () => {
		const { value, userAns } = this.state;
		const { totalQues } = this.props;

		if (!value) return;

		userAns.push(value);

		this.setValue('currentQues', 0);
		this.setValue('userAns', userAns);

		this.setState({
			currentQues: 0,
			value: '',
			disabled: true
		});

		let correctAns = 0;
		totalQues.map((ques, index) => {
			if (Number(userAns[index]) === Number(ques.answer))
				correctAns = correctAns + 1;
		});

		var percentage = ((correctAns / totalQues.length) * 100)
			.toFixed(2)
			.replace(/\.00$/, '');

		this.props.showResult(correctAns, percentage);
	};

	componentWillUnmount() {
		this.setState({ userQuizKey: '', userAns: [], currentQues: 0 });
		localStorage.removeItem('userQuizKey');
		localStorage.removeItem('userAns');
		localStorage.removeItem('currentQues');
	}

	renderQues = () => {
		const { value, disabled, currentQues, userAns } = this.state;
		const { totalQues } = this.props;

		if (userAns.length === totalQues.length) return;

		const q = totalQues[currentQues];

		return (
			<Card title={`Question: ${userAns.length + 1} of ${totalQues.length}`}>
				<h2>{q.question}</h2>
				<RadioGroup onChange={this.onChange} value={value}>
					<Radio style={radioStyle} value={1}>
						{q.opt1}
					</Radio>
					<Radio style={radioStyle} value={2}>
						{q.opt2}
					</Radio>
					<Radio style={radioStyle} value={3}>
						{q.opt3}
					</Radio>
					<Radio style={radioStyle} value={4}>
						{q.opt4}
					</Radio>
				</RadioGroup>
				<Divider />
				{userAns.length + 1 === totalQues.length ? (
					<Button
						type="primary"
						block
						disabled={disabled}
						onClick={this.calcResult}
					>
						Submit <Icon type="check" />
					</Button>
				) : (
					<Button
						type="primary"
						block
						disabled={disabled}
						onClick={this.saveAns}
					>
						Next <Icon type="right" />
					</Button>
				)}
			</Card>
		);
	};

	render() {
		const { userQuizKey } = this.state;
		const { quizKey } = this.props;

		return (
			<Fragment>
				<Row gutter={16} type="flex" justify="center" align="center">
					{userQuizKey === quizKey ? (
						<Col xs={24} sm={12} lg={12}>
							{this.renderQues()}
						</Col>
					) : (
						<QuizKey quizKey={quizKey} setKey={this.setKey} />
					)}
				</Row>
			</Fragment>
		);
	}
}

export default Questions;
