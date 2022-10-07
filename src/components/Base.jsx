import React from 'react';
import { Router, Location, Redirect } from '@reach/router';
import Earn from './Earn';

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const Base = () => (
  <div className="wraper">
        <Earn path="/earn" />
  </div>
);
export default Base;