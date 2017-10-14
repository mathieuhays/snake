/**
 *  Webpack Config
 */

const PATH = require('path');
const CONTEXT = PATH.join(__dirname, "src", "js");

module.exports = {
  context: CONTEXT,
  entry: "./app.js",
  devtool: "source-map",
  output: {
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: [ "env" ]
        }
      }
    ]
  },
  plugins: []
};
