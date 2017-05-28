const path = require('path');
const webpack = require('webpack');

const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');


const DEBUG = !!process.env.DEBUG;
const DEBUG_PORT = process.env.DEBUG_PORT || 9090;
const BUILD_THREADS = process.env.THREADS || 4;

const DIST = process.env.DIST || path.resolve(__dirname, 'assets');
const PUBLIC_PATH = '/assets/';

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

  entry: {
    app: path.resolve(__dirname, 'src/index'),
    extlib: [
      'babel-polyfill',
      'classnames',
      'react',
      'react-dom',
      'react-router',
      'react-redux',
      'redux',
      'unfetch',
    ],
  },

  output: {
    path: DIST,
    filename: '[name].[hash:8].js',
    chunkFilename: 'chunk.[id].[hash:8].js',
    publicPath: PUBLIC_PATH,
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'happypack/loader?id=es6',
        include: path.resolve(__dirname, 'src/'),
      },
      {
        test: /\.(png|jpe?g|gif|tiff)$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin(DEFINES),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'extlib',
      filename: 'extlib.[hash:8].js',
    }),
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/static/index.ejs',
      filename: 'index.html',
      inject: 'body',
      chunks: ['app', 'extlib'],
    }),
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
  devServer: {
    hot: true,
    inline: true,
    port: DEBUG_PORT,
    proxy: {
      '/**': {
        bypass: function(req, _res, _opt) {
          return req.path.indexOf(PUBLIC_PATH) === 0
            ? req.path
            : path.resolve(PUBLIC_PATH, 'index.html');
        },
      }
    }
  }

};
