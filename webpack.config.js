const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: "./src/binding.js",
  output: {
    path: './public',
    filename: 'chart.dist.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({use: "css-loader"})
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("chart.dist.css"),
  ]
};
