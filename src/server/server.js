const express = require('express');
const fetch = require('node-fetch');
const jsdom = require('jsdom');

// patch
const { window } = new jsdom.JSDOM('<html></html>');
global.fetch = fetch;
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.location = window.location;

// require render function after env is patched
const handleRender = require('../../built/server/render.js');

const app = express();
app.use(handleRender);
app.listen(9091);
