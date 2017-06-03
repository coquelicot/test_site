import {
  Route,
  Switch,
} from 'react-router-dom';

import HomePage from 'component/HomePage';


export default (
  <Switch>
    <Route path='/home' component={HomePage} />
  </Switch>
);
