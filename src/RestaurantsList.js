import React from 'react';
import idb from 'idb';
import { Grid, Row, Col } from 'react-bootstrap';
import { Form, FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import RestaurantView from './RestaurantView';
import './RestaurantsList.css';



class RestaurantsList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			shownRestaurants: null,
			reviews: null
		}
		idb.open('appdata', 1).then(db => {
      const restaurant = db.transaction('restaurant').objectStore('restaurant');
      const review = db.transaction('review').objectStore('review');
      restaurant.getAll().then(data => {
				this.restaurants = data;
	      this.setState({shownRestaurants: data})
      });
      let reviews = {}
			review.getAllKeys().then(keys => {
				Promise.all(keys.map(key => review.get(key)))
				.then(values => {
					for (let i=0; i<keys.length; i++) {
						reviews[keys[i]] = values[i];
					}
					this.setState({reviews: reviews});
				})
			});
		});
		this.filter = this.filter.bind(this);
	}

  filter() {
    this.setState({
      shownRestaurants: this.restaurants.filter(
        item => (item.name.indexOf(this.name.value) !== -1 &&
          item.rating >= this.rating.value)
      ) 
    })
  }

	render() {
		if (!this.state.shownRestaurants || !this.state.reviews) return null;
		const list = this.state.shownRestaurants.map(item => 
    	<RestaurantView
    	  info={item} 
    	  key={'restaurant-'+item.id}
    	  reviews={this.state.reviews[item.id]}
    	  reviewNum={2}
    	  role='article'
    	 />
		);

		return (
			<Grid>
			<Row>
				<Col xs={12} sm={12} md={10} mdOffset={1} lg={8} lgOffset={2}>
					<p id='filter-description'>Filter the list by restaurant name and minimum average rating.</p>
				</Col>
			</Row>
			<Row>
			<Form role='search' aria-describedby='filter-description' className='filter-form' inline>
				<Col xs={12} sm={6} md={4} mdOffset={1} lg={4} lgOffset={2}>
				<FormGroup controlId='filter-keyword'>
					<ControlLabel>Name: </ControlLabel>
					<FormControl
						type='text'
						className='filter-input'
						inputRef={ref => {this.name = ref;}}
						onChange={() => {if (!this.name.value) this.setState({shownRestaurants: this.restaurants})}}
					/>
				</FormGroup>
			</Col>
			<Col xs={12} sm={6} md={5} lg={4}>
			<FormGroup controlId='filter-criteria'>
				<ControlLabel>Rating: </ControlLabel>
				<FormControl
			 		componentClass='select'
			 		className='filter-input'
					inputRef={ref => {this.rating = ref;}}
				>
					<option value='5'>5 stars</option>
					<option value='4'>4 stars</option>
					<option value='3'>3 stars</option>
					<option value='2'>2 stars</option>
					<option value='1'>1 star</option>
				</FormControl>
			</FormGroup>
			<Button onClick={this.filter} className='filter-button'>Filter</Button>
			</Col>
			</Form>
			</Row>
			<main className='list'>{list}</main>
			</Grid>
		);
	}
}


export default RestaurantsList;