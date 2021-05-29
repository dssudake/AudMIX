import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Home from './pages/Home';
import Upload from './pages/Upload';
import Editor from './pages/Editor';
import List from './pages/List';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Activate from './pages/Activate';
import { load_user } from './redux/actions/index';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(load_user());
  }, []);

  return (
    <div className="container-fluid bg-dark pt-2" style={{ minHeight: '100vh' }}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/list" component={List} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/upload" component={Upload} />
        <Route exact path="/editor/:id" component={Editor} />
        <Route exact path="/activate/:uid/:token" component={Activate} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
