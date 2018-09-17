import React, { Component, Fragment } from 'react';
import './style.css';

import { Card, Button, Row, Col } from 'antd';

class Result extends Component {
	render() {
		const { currentQuiz } = this.props;
		console.log(currentQuiz);
		const { cat, subCat, percentage, correctAns, passing } = currentQuiz;

		let RColor, feedback;

		let iPercentage = Number(percentage);

		if (iPercentage === 100) {
			RColor = 'teal';
			feedback = (
				<p style={{ textAlign: 'center' }}>Wohoo.. Great, You are pass!</p>
			);
		} else if (iPercentage < 100 && iPercentage >= passing) {
			RColor = 'green';
			feedback = <p style={{ textAlign: 'center' }}>Congrats! You are pass.</p>;
		} else {
			RColor = 'red';
			feedback = (
				<p style={{ textAlign: 'center' }}>
					Oh No! Your Are Failed... <br /> Better Luck Next Time
				</p>
			);
		}

		return (
			<Fragment>
				<Row gutter={16} type="flex" justify="center" align="center">
					<Col xs={24} sm={12} lg={12}>
						<Card title={'Result: ' + cat + ' Quiz ' + subCat}>
							<svg viewBox="0 0 36 36" className={'circular-chart ' + RColor}>
								<path
									className="circle-bg"
									d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
								/>
								<path
									className="circle"
									strokeDasharray={percentage + ', 100'}
									d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
								/>
								<text x="19" y="21" id="percentage">
									{percentage}%
								</text>
							</svg>
							<br />
							{feedback}
							<h3 style={{ textAlign: 'center' }}>
								Correct Answers: {correctAns}
								<br />
								<br />
								<Button
									type="primary"
									onClick={() => this.props.showPage('home')}
								>
									Home
								</Button>
							</h3>
						</Card>
					</Col>
				</Row>
			</Fragment>
		);
	}
}

export default Result;
