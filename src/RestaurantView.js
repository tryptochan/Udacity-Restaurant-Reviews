import React from 'react';
import { Media, Panel } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router'
import ReactStars from './react-stars';
import ReviewView from './ReviewView';

function RestaurantView(props) {
	if (!props.info) return null;
	const { role } = props;
	return (
	<Row key={props.info.id} role={role}>
    <Col xs={12} sm={12} md={10} mdOffset={1} lg={10} lgOffset={1}>
		<Panel>
			<Row>
	    <Col xs={12} sm={12} md={6} lg={6} >
				<Media>
					<Media.Left align='top'>
						<img width={96} height={96} src={props.info.photo} alt={'Photo of '+props.info.name} />
					</Media.Left>
					<Media.Body>
					{props.reviewNum ? (
						<Media.Heading>
						<Link to={'/restaurant/'+props.info.id}>
							{props.info.name}</Link></Media.Heading>
					)
					: (<Media.Heading>{props.info.name}</Media.Heading>)
					}
						<ReactStars
						  value={props.info.rating}
						  size={28}
						  half={true}
						  edit={false}
						  color2={'#d33a35'}
						/>
					</Media.Body>
				</Media>
			</Col>
	    <Col xs={12} sm={12} md={4} mdOffset={2} lg={4} lgOffset={2}>
	    	<Media>
	    		<Media.Body>
					<p><b>Hours</b>: {props.info.hours}</p>
	    		<address 
	    			dangerouslySetInnerHTML={{__html: props.info.address.replace(/\n/g, '<br/>')}} 
    			/>
	    		</Media.Body>
	  		</Media>
	    </Col>
	    </Row>
	    	<ReviewView reviews={props.reviews} num={props.reviewNum} />
		</Panel>
		</Col>
	</Row>
	)
}

export default RestaurantView;