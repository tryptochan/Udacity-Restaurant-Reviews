import React from 'react';
import ReactStars from './react-stars';

const reviewBorder = {
	borderTop: '1px solid #dfd7ca',
	marginTop: 15
}

function ReviewView(props) {
	if (!props.reviews || props.reviews.length === 0) return null;
	const num = props.num || props.reviews.length;
	let reviews = props.reviews.slice().reverse().slice(0, num);
	return <div>{reviews.map(review => (
		<div key={review.name+'-'+review.date} style={reviewBorder}>
		<ReactStars
		  value={review.rating}
		  size={24}
		  half={false}
		  edit={false}
		  color2={'#d33a35'}
		/>

		<p>{review.comments}</p>
		<p><b>{review.name}</b> {review.date}</p>
		</div>
	))}</div>;
}

export default ReviewView;