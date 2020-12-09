import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';

function App() {
  return (
    <div className="container-fluid bg-dark" style={{ minHeight: '100vh' }}>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
