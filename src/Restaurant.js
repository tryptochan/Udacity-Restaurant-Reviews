import React from 'react';
import idb from 'idb';
import RestaurantView from './RestaurantView';
import ReactStars from './react-stars';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormControl, FormGroup, ControlLabel, Button, HelpBlock } from 'react-bootstrap';


class Restaurant extends React.Component {
	constructor(props) {
		super(props);
		const id = props.params.id;
		this.state = {
			restaurant: null,
			reviews: null,
			rating: 5,
			nameState:  null,
			commentsState: null
		}
		idb.open('appdata', 1).then(db => {
      const restaurant = db.transaction('restaurant').objectStore('restaurant');
      const review = db.transaction('review').objectStore('review');
      restaurant.get(id).then(data => {
	      this.setState({restaurant: data});
      });
			review.get(id).then(data => {
				this.setState({reviews: data});
			});
		});
		this.submit = this.submit.bind(this);
	}


	submit() {
		if (!this.name.value) {
			this.setState({nameState: 'error'});
			return;
		}
		if (!this.comments.value) {
			this.setState({commentsState: 'error'});
			return;
		}
		let newReviews = this.state.reviews.slice();
		newReviews.push({
			rating: this.state.rating,
			name: this.name.value,
			comments: this.comments.value,
			date: new Date().toLocaleDateString()
		})
		idb.open('appdata', 1).then(db => {
      const review = db.transaction('review', 'readwrite').objectStore('review');
      this.setState({reviews: newReviews})
			review.put(newReviews, this.props.params.id);
			return review.complete;
		});
		this.name.value ='';
		this.comments.value = '';
	}

	render() {
  	return (
  		<Grid>
  		<RestaurantView info={this.state.restaurant} reviews={this.state.reviews} role='main'/>
  		<Row>
	    <Col xs={12} sm={12} md={6} mdOffset={1} lg={5} lgOffset={2}>
  		<form>
  		<h4>Submit your review below:</h4>
  		
			<FormGroup controlId='form-name' validationState={this.state.nameState}>
				<ControlLabel>Name</ControlLabel>
				<FormControl type='text' placeholder='Enter your name'
				  inputRef={ref => this.name = ref} style={{width: 250}}
				  onChange={() => {if (this.state.nameState && this.name.value) this.setState({nameState: null})}}
				  aria-required={true}
				  required
				/>
				{this.state.nameState && <HelpBlock>Name is required</HelpBlock>}
			</FormGroup>
			<label className='control-label'>Rating
			<ReactStars
			  value={this.state.rating}
			  half={false}
			  size={28}
			  color2={'#d33a35'}
			  onChange={(value) => this.setState({rating: value})}
			/>
			</label>

			<FormGroup controlId='form-comments' validationState={this.state.commentsState}>
				<ControlLabel>Comments</ControlLabel>
				<FormControl componentClass='textarea' placeholder='Enter comments'
					inputRef={ref => this.comments = ref}
				  onChange={() => {if (this.state.commentsState && this.comments.value) this.setState({commentsState: null})}}
				  aria-required={true}
				  required
			  />
				{this.state.commentsState && <HelpBlock>Comments are required</HelpBlock>}
			</FormGroup>
			<Button onClick={this.submit}>Submit</Button>
			</form>
			</Col></Row>
  		</Grid>
  	)
	}
}

export default Restaurant;