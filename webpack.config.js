// http://webpack.github.io/docs/configuration.html
// http://webpack.github.io/docs/webpack-dev-server.html
const appRoot = 'src'; // the app root folder: src, src_users, etc

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

global.appRoot = appRoot; // the app root folder, needed by the other webpack configs

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:1337',
    'webpack/hot/only-dev-server',
    'babel-polyfill',
    path.join(__dirname, appRoot, 'index.jsx'),
  ],
  output: {
    path: path.join(__dirname, 'public/js'),
    publicPath: 'js/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: [/\.js$/, /\.jsx$/],
        use: ['react-hot-loader', 'babel-loader'],
        exclude: /node_modules/,
      },
      {
        // https://github.com/jtangelder/sass-loader
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        use: 'url-loader?limit=100000',
      },
    ],
  },
  resolve: {
    alias: {
      commonStyles: path.resolve(__dirname, appRoot, 'stylesheets/common.scss'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/api': '' },
      },
    },
  },
  devtool: '#eval-source-map',
  plugins: [
    new CleanWebpackPlugin(['css/main.css', 'js/bundle.js'], {
      root: path.join(__dirname, '/public'),
      verbose: true,
      dry: false, // true for simulation
    }),
  ],
};
