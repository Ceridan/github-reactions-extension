const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const path = require('path')

const PACKAGE = require('./package.json')

const config = {
  entry: {
    background: path.resolve(__dirname, 'src/js/background.js'),
    content: path.resolve(__dirname, 'src/js/content.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: (pathData) => (pathData.chunk.name === 'background' ? '[name].js' : 'js/[name].js'),
  },
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          transform: (content) => content.toString().replace('{{PACKAGE_VERSION}}', PACKAGE.version),
          force: true,
        },
      ],
    }),
  ],
}

module.exports = (_, argv) => {
  config.devtool = argv.mode === 'development' ? 'source-map' : false
  if (argv.mode === 'production') {
    config.plugins.push(
      new ZipPlugin({
        path: '../out',
        filename: `GitHubReactions_v${PACKAGE.version}.zip`,
      }),
    )
  }
  return config
}
