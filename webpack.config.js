// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const outputDirectory = path.resolve(__dirname, 'dist/webpack');

module.exports = {
  mode: 'development',
  entry: {
    index: path.resolve(__dirname, 'src/index.ts'),
  },
  devtool: 'inline-source-map',
  output: {
    path: outputDirectory,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: { configFile: path.resolve(__dirname, 'tsconfig.json') },
          },
        ],
      },
      {
        test: /\.styl$/i,
        loader: 'style-loader!css-loader!stylus-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg|webp)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, './public/'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.css', '.styl', '.png', '.jpg', '.webp'],
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.done.tap('CopyFiles', () => {
          const ncp = require('ncp').ncp;
          ncp(path.resolve(__dirname, './public'), outputDirectory, function(err) {
            console.log('Copy done!');
          });
        });
      },
    },
  ],
};
