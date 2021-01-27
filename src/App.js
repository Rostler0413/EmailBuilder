import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import EmailBuilder from './emails/EmailTemplateBuilder';
import './App.css';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="*">
          <EmailBuilder />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
