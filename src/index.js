import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import { store } from 'store';


// Side effect
import 'static/css/reset.css';
import 'static/css/base.css';

ReactDom.render(
  <Provider store={ store }>
    <div> TODO </div>
  </Provider>,
  document.getElementById('react-root'),
);
