import React from 'react';
import { Row, Col, Card, Button } from 'antd';

const QuizSubList = props => {
	const {
		quizesCat,
		quizIndex,
		quizes,
		takenQuiz,
		startQuiz,
		disabled
	} = props;

	return (
		<Row gutter={16} type="flex" justify="center" align="top">
			{quizes[quizesCat[quizIndex]].map((elem, index) => (
				<Col
					xs={24}
					sm={12}
					md={8}
					style={{ marginBottom: 16 }}
					key={Math.random()}
				>
					<Card
						title={quizesCat[quizIndex] + ' Quiz ' + index}
						actions={[
							takenQuiz &&
							takenQuiz[quizesCat[quizIndex]] &&
							takenQuiz[quizesCat[quizIndex]][index] ? (
								<Button type="primary" disabled>
									Start Quiz
								</Button>
							) : (
								<Button
									type="primary"
									onClick={() =>
										startQuiz(
											quizesCat[quizIndex],
											index,
											elem.key,
											elem.passing
										)
									}
									disabled={disabled}
								>
									Start Quiz
								</Button>
							)
						]}
					>
						{console.log('***', quizesCat[quizIndex])}
						{elem.desc}
						<br /> <br />
						<span style={{ color: 'darkgray' }}>
							Passing Score: {elem.passing}%
						</span>
						<br />
						<span style={{ color: 'darkgray' }}>
							Quiz Duration: {elem.duration} mins.
						</span>
						{takenQuiz &&
							takenQuiz[quizesCat[quizIndex]] &&
							takenQuiz[quizesCat[quizIndex]][index] && (
								<div style={{ fontWeight: 'bold', marginTop: 16 }}>
									Your Score: {takenQuiz[quizesCat[quizIndex]][index].marks}%
									<br />
									Date Attempted: {takenQuiz[quizesCat[quizIndex]][index].date}
								</div>
							)}
					</Card>
				</Col>
			))}
		</Row>
	);
};

export default QuizSubList;
