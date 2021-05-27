import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Upload from './pages/Upload';
import Editor from './pages/Editor';
import List from './pages/List';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="container-fluid bg-dark pt-2" style={{ minHeight: '100vh' }}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/list" component={List} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/upload" component={Upload} />
        <Route exact path="/editor/:id" component={Editor} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
