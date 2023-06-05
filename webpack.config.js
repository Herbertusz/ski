/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

let minifier;

if (process.env.NODE_ENV === 'production') {
  minifier = new TerserPlugin({
    test: /\.m?js(\?.*)?$/i,
    terserOptions: {
      sourceMap: false
    }
  });
  outputPath = path.resolve(__dirname, 'build', 'prod');
} else if (process.env.NODE_ENV === 'development') {
  minifier = new TerserPlugin({
    test: /\.m?js(\?.*)?$/i,
    terserOptions: {
      sourceMap: true
    }
  });
  outputPath = path.resolve(__dirname, 'build', 'dev');
}

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ["*", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      PKGNAME: JSON.stringify(require('./package.json').version)
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/index.html', to: outputPath },
        { from: './src/favicon.ico', to: outputPath },
        { from: './src/assets', to: outputPath + '/assets' },
        { from: './src/css', to: outputPath + '/css' }
      ]
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [minifier]
  },
  entry: './src/index.ts',
  output: {
    filename: 'index.min.js',
    path: outputPath
  },
  devServer: {
    static: {
      directory: outputPath
    },
    compress: true,
    port: 9000
  }
};
