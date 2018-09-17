import React, { Component } from 'react';
import './style.css';
import { Card, Form, Icon, Input, Button, message } from 'antd';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const FormItem = Form.Item;

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			disabled: false
		};
	}

	componentWillUnmount = () => {
		firebase
			.database()
			.ref('App/users')
			.off();
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ disabled: true });

				const { name, email, password } = values;

				firebase
					.auth()
					.createUserWithEmailAndPassword(email, password)
					.then(res => {
						firebase
							.database()
							.ref('App/users')
							.child(res.user.uid)
							.set({
								name: name,
								email: email,
								id: res.user.uid,
								admin: false
							});
						message.success('Registration Successful');
						this.setState({ disabled: false });
					})
					.catch(err => {
						this.setState({ disabled: false });
						message.error(err.message);
						console.clear();
					});
			}
		});
	};

	login = e => {
		e.preventDefault();
		this.props.showPage('login');
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { disabled } = this.state;

		return (
			<Card title="Register" id="login-form" bordered={false} style={{ width: 300 }}>
				<Form onSubmit={this.handleSubmit}>
					<FormItem>
						{getFieldDecorator('name', {
							rules: [{ required: true, message: 'Please input your name!' }]
						})(
							<Input
								prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="name"
								autoComplete="off"
							/>
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('email', {
							rules: [{ required: true, message: 'Please input your email!' }]
						})(
							<Input
								prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="email"
								autoComplete="off"
							/>
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please input your Password!' }]
						})(
							<Input
								prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
								type="password"
								placeholder="Password"
								autoComplete="off"
							/>
						)}
					</FormItem>
					<FormItem>
						<Button
							type="primary"
							disabled={disabled}
							htmlType="submit"
							className="login-form-button"
						>
							Register
						</Button>
						Or <a onClick={this.login}>Login!</a>
					</FormItem>
				</Form>
			</Card>
		);
	}
}

export default Form.create()(Register);
