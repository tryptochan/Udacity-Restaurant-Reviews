import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App from './App';
import RestaurantsList from './RestaurantsList';
import Restaurant from './Restaurant';
import './bootstrap.css';

ReactDOM.render(
	<Router history={browserHistory}>
    <Route path="/" component={App} >
      <IndexRoute component={RestaurantsList}
      />
        <Route path="/restaurant/:id" component={Restaurant}/>
    </Route>
</Router>
	
  , document.getElementById('root')
);
