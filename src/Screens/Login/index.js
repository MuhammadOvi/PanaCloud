import React, { Component } from 'react';

import './style.css';

import { Card, Form, Icon, Input, Button, message } from 'antd';

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const FormItem = Form.Item;

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			disabled: false
		};
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ disabled: true });

				const { email, password } = values;

				firebase
					.auth()
					.signInWithEmailAndPassword(email, password)
					.catch(err => {
						this.setState({ disabled: false });
						message.error(err.message);
						console.clear();
					});
			}
		});
	};

	register = e => {
		e.preventDefault();
		this.props.showPage('register');
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { disabled } = this.state;

		return (
			<Card title="Login" id="login-form" bordered={false} style={{ width: 300 }}>
				<Form onSubmit={this.handleSubmit}>
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
							Log in
						</Button>
						Or <a onClick={this.register}>register now!</a>
					</FormItem>
				</Form>
			</Card>
		);
	}
}

export default Form.create()(Login);
