/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Row, Spinner } from 'react-bootstrap';

import Home from './pages/Home';
import Upload from './pages/Upload';
import Editor from './pages/Editor';
import List from './pages/List';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Activate from './pages/Activate';
import { load_user } from './redux/actions/index';

function Loader() {
  return (
    <Row className="justify-content-center" style={{ paddingTop: '40vh' }}>
      <Spinner animation="border" variant="primary" />
    </Row>
  );
}

// Controls Private routes, this are accessible for authenticated users.  [ e.g : upload, list, editor ]
function PrivateRoute({ component: Component, ...rest }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => dispatch(load_user()), []);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth.isLoading) {
          return <Loader />;
        } else if (auth.isAuthenticated) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
}

// Public routes accessible to all users. [ e.g. home, notfound ]
// and restricted routes disabled for authenticated users. [ e.g : login , signup ]
function PublicRoute({ component: Component, restricted, ...rest }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => dispatch(load_user()), []);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth.isLoading) {
          return <Loader />;
        } else if (auth.isAuthenticated && restricted) {
          return <Redirect to="/list" />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
}

function App() {
  return (
    <div className="container-fluid bg-dark pt-2" style={{ minHeight: '100vh' }}>
      <Switch>
        <PublicRoute exact path="/" restricted={false} component={Home} />
        <PrivateRoute exact path="/list" component={List} />
        <PublicRoute exact path="/login" restricted={true} component={Login} />
        <PublicRoute exact path="/signup" restricted={true} component={Signup} />
        <PrivateRoute exact path="/upload" component={Upload} />
        <PrivateRoute exact path="/editor/:id" component={Editor} />
        <PublicRoute exact path="/activate/:uid/:token" restricted={false} component={Activate} />
        <PublicRoute restricted={false} component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
