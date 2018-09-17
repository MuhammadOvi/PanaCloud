import React from 'react';
import { Row, Col, Card, Button } from 'antd';

const QuizList = props => {
	const { quizesCat, QuizList } = props;

	return (
		<Row gutter={16}>
			{quizesCat.map((quiz, index) => (
				<Col xs={24} sm={12} md={8} key={quiz} style={{ marginBottom: 16 }}>
					<Card
						actions={[
							<Button type="primary" onClick={() => QuizList(index)}>
								Quiz List
							</Button>
						]}
					>
						<Card.Meta align="center" title={quiz + ' Quiz'} />
					</Card>
				</Col>
			))}
		</Row>
	);
};

export default QuizList;
