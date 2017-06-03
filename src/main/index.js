import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { createStore } from './store';
import route from 'route';

const preloadedState = window.__PRELOADED_STATE__ || {};
delete window.__PRELOADED_STATE__;

ReactDom.render(
  <Provider store={createStore(preloadedState)}>
    <BrowserRouter>
      {route}
    </BrowserRouter>
  </Provider>,
  document.getElementById('react-root'),
);
