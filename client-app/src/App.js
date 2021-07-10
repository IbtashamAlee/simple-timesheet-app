import './App.css';
import {Switch, BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import React from 'react'
import Home from "./components/home";
import NotFound from "./components/not-found";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import Header from "./components/header";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/not-found" component={NotFound}/>
                <Route path="/signin" component={SignIn}/>
                <Route path="/signup" component={SignUp}/>
                <Route path="/" exact component={Home}/>

                <Redirect to="/not-found"/>
            </Switch>
        </Router>
    );
}

export default App;
