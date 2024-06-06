import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import BookList from './components/BookList';
import BookSearch from './components/BookSearch';
import BookDetails from './components/BookDetails';
import ShoppingCart from './components/ShoppingCart';

const App = () => (
    <Router>
        <NavBar />
        <Switch>
            <Route path="/" exact component={BookList} />
            <Route path="/search" component={BookSearch} />
            <Route path="/books/:id" component={BookDetails} />
            <Route path="/cart" component={ShoppingCart} />
        </Switch>
    </Router>
);

export default App;
