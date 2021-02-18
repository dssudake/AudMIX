import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Upload from './pages/Upload';

function App() {
  return (
    <div className="container-fluid bg-dark" style={{ minHeight: '100vh' }}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/upload" component={Upload} />
      </Switch>
    </div>
  );
}

export default App;
