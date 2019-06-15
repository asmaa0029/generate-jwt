import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { HashRouter, Route, Switch, Link } from 'react-router-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Login from './Login';
import Products from './Products';
import * as serviceWorker from './serviceWorker';

const Rout = ()=>( <Switch>
    <Route path="/Salhi/:link" component={App} />
    <Route path="/Products" component={Products} />
    <Route path="/" component={Login} />
  </Switch>);

ReactDOM.render(
    <HashRouter><MuiThemeProvider><Rout /></MuiThemeProvider></HashRouter>
    , document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
