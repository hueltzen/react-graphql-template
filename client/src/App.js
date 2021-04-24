import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import AuthorizedRoute from "./util/AuthorizedRoute";

import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.scss";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <Switch>
            <AuthorizedRoute exact path="/" component={Dashboard} />

            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
