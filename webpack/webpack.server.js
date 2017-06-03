const path = require('path');
const webpack = require('webpack');

const HappyPack = require('happypack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');


const BASE_DIR = path.resolve(__dirname, '../');

const DEBUG = !!process.env.DEBUG;
const BUILD_THREADS = process.env.THREADS || 4;

const DIST = process.env.DIST || path.resolve(BASE_DIR, 'built/server');
const PUBLIC_PATH = '/';

const DEFINES = {
  __DEBUG__: DEBUG,
  __BUILD_TIME__: new Date().getTime(),
  'process.env': {
    NODE_ENV: JSON.stringify(DEBUG && 'debug' || 'production'),
  },
  __CONFIG__: {
    TITLE: JSON.stringify('Test'),
    ROOT_ELEMENT_ID: JSON.stringify('react-root'),
  },
};


module.exports = {

  target: 'node',

  entry: {
    app: path.resolve(BASE_DIR, 'src/server/render'),
  },

  output: {
    path: DIST,
    filename: 'render.js',
    publicPath: PUBLIC_PATH,
    libraryTarget: 'commonjs2',
  },

  resolve: {
    modules: [
      path.resolve(BASE_DIR, 'src'),
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'happypack/loader?id=es6',
        include: path.resolve(BASE_DIR, 'src/'),
      },
      {
        test: /\.(png|jpe?g|gif|tiff)$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
        },
      },
      // for static css file
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
        include: path.resolve(BASE_DIR, 'src/static'),
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin(DEFINES),
    new webpack.ProvidePlugin({
      React: 'react',
      styled: 'styled-components',
    }),
    new ProgressBarPlugin(),
    new HappyPack({
      id: 'es6',
      threads: BUILD_THREADS,
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              'es2015',
              'react',
              'stage-1',
            ],
          },
        }
      ],
    }),
  ].concat(DEBUG && [] || [
    // enabled only in non debug mode
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ]),

  // DEV tools
  devtool: 'source-map',

};
