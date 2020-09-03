const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function generateEntries() {
  var entryFiles = glob.sync('./src/*/*.js');
  const map = {};
  entryFiles.forEach((filePath) => {
    const entry = path.parse(filePath).name;
    map[entry] = filePath;
  });
  return map;
}

function generateHtmlPlugins() {
  var entryFiles = glob.sync('./src/*/*.js');
  let arr = [];
  entryFiles.forEach((filePath) => {
    const entry = path.parse(filePath).name;
    arr.push(
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: entry + '.html',
        favicon: './images/favicon.ico',
        chunks: [entry, 'vendor']
      })
    );
  });
  return arr;
}

const config = {
  entry: generateEntries(),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
      }
    ]
  },
  plugins: [...generateHtmlPlugins(), new MiniCssExtractPlugin(), new CleanWebpackPlugin()],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};

module.exports = config;
