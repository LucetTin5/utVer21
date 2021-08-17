const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const BASE_JS = './src/client/scripts/';

module.exports = {
  entry: {
    main: BASE_JS + 'main.js',
    videoPlayer: BASE_JS + 'videoPlayer.js',
    recorder: BASE_JS + 'recorder.js',
    commentSection: BASE_JS + 'commentSection.js',
  },
  mode: 'development',
  plugins: [
    new MiniCSSExtractPlugin({
      filename: 'css/styles.css',
    }),
  ],
  watch: true,
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'assets'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          // Creates 'style' nodes from JS strings
          MiniCSSExtractPlugin.loader,
          // Translates CSS into commonJS
          'css-loader',
          // Compiles Sass/Scss into CSS
          'sass-loader',
        ],
      },
    ],
  },
};
