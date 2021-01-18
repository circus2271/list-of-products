const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const templates = require('./templates')

module.exports = {
  entry: {
    bundle: [
      path.resolve(__dirname, '../src/scripts/index.ts')
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].bundle.js',
    publicPath: '/'
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
    alias: {
      'media': path.resolve(__dirname, '../src/media/'),
    }
  },
  module: {
    rules: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
          inlineRequires: /\.(png|svg|jpe?g|webp|gif|ico)$/i,
          rootRelative: path.join(__dirname, '../src/hbs/'),
          precompileOptions: {
            knownHelpersOnly: false
          },
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer",
                  ],
                ],
              },
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.woff2$/i,
        use: 'url-loader',
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, '../manifest.json'),
              to: 'manifest.json'
            },
            {
              from: path.resolve(__dirname, '../src/media/icons/maskable_icon.png'),
              to: 'pwa/icons/maskable_icon.png'
            }
          ]
        }
    ),
    ...templates.map(template => new HtmlWebpackPlugin(template)),
  ]
}