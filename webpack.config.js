var env = process.env.NODE_ENV || "development";
var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');

var plugins = [
];

if(env !== 'development') {
  plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(env)
    },
    'SERVER_URL': JSON.stringify("http://linker.thoughtsync.me")
  }));
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new ManifestPlugin());
} else {
  plugins.push(new webpack.DefinePlugin({
    'SERVER_URL': JSON.stringify("http://localhost:3000")
  }));
}


module.exports = {
  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader?optional=runtime&stage=0'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: plugins
};
