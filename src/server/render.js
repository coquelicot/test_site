import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';

import { createStore } from '../main/store';
import route from 'route';

import template from 'html-loader?removeAttributeQuotes=false!../../built/client/index.html';

function handleRender(req, res) {

  const store = createStore();
  const context = {};
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter
        location={req.url}
        context={context}
      >
        {route}
      </StaticRouter>
    </Provider>
  );

  if (context.url) {
    res.redirect(302, context.url);
  } else {
    res.send(template.replace(
      '<section id="react-root"></section>',
      `
        <section id="react-root">
          ${html}
        </section>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState()).replace(/</g, '\\u003c')};
        </script>
      `
    ));
  }
}

module.exports = handleRender;
