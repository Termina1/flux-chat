var env = process.env.NODE_ENV || "development";
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');

var plugins = [
];

if(env !== 'development') {
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(env)
    }
  }));
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new ManifestPlugin());
}


module.exports = {
  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader?optional=runtime&stage=0'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: plugins
};
