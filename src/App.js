import React, { Component } from 'react';
import idb from 'idb';
import { Navbar } from 'react-bootstrap';

class App extends Component {
  constructor() {
    super();
    this.state = {
      shownRestaurants: null,
      reviews: null
    }
    this.db = idb.open('appdata', 1, function(upgradeDb) {
      upgradeDb.createObjectStore('restaurant', {
        keyPath: 'id'
      });
      upgradeDb.createObjectStore('review');
    });
    fetch('/restaurants.json')
    .then(response => response.json())
    .then(j => {
      this.restaurants = j.restaurants;
      this.db.then(db => {
        let restaurant = db.transaction('restaurant', 'readwrite').objectStore('restaurant');
        let review = db.transaction('review', 'readwrite').objectStore('review');
        restaurant.count().then(cnt => {
          if (cnt === 0) j.restaurants.forEach(item => restaurant.put(item));
        });
        review.count().then(cnt => {
          if (cnt === 0) {
            Object.keys(j.reviews).forEach(k => {
              review.put(j.reviews[k], k);
            })
          }
        });
      })
    })
  }


  render() {
    return (
      <div className="App">
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand><a href="/">Restaurant Reviews App</a></Navbar.Brand>
        </Navbar.Header>
      </Navbar> 
        {this.props.children}
      </div>
    );
  }
}

export default App;