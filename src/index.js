import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import { store } from 'store';
import { ROOT_ELEMENT_ID } from 'constant';


ReactDom.render(
  <Provider store={ store }>
    <div> TODO </div>
  </Provider>,
  document.getElementById(ROOT_ELEMENT_ID)
);
