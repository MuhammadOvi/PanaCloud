import React, { Component, Fragment } from 'react';

import { Card, Form, Icon, Button, Input, message, Col } from 'antd';

const FormItem = Form.Item;

class QuizKey extends Component {
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (values.key === this.props.quizKey) {
					message.success('Correct');
					this.props.setKey(values.key);
				} else {
					message.error('Incorrect Key!');
				}
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<Fragment>
				<Col xs={24} sm={12} lg={12}>
					<Card title="Quiz Key" style={{ width: '100%' }}>
						<Form onSubmit={this.handleSubmit}>
							<FormItem>
								{getFieldDecorator('key', {
									rules: [{ required: true, message: 'Please input quiz key!' }]
								})(
									<Input
										prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.35)' }} />}
										type="password"
										placeholder="Key"
										autoComplete="off"
									/>
								)}
							</FormItem>
							<FormItem>
								<Button type="primary" htmlType="submit" block>
									Submit
								</Button>
							</FormItem>
						</Form>
					</Card>
				</Col>
			</Fragment>
		);
	}
}

export default Form.create()(QuizKey);
