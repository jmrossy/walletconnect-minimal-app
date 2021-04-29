const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  target: 'web',
  externals: {
    'crypto': 'crypto',
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    })
  ],
  resolve: {
    // fallback: { 
    //   "crypto": require.resolve("crypto-browserify"),
    //   "stream": require.resolve("stream-browserify")
    // }
  }
};

module.exports = config;