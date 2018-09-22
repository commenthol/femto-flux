// const mode = 'development'
const mode = 'production'

module.exports = {
  entry: `${__dirname}/container.js`,
  output: {
    filename: 'container.bundle.js',
    path: __dirname
  },
  devtool: mode === 'development' ? 'source-map' : undefined,
  mode,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-react-jsx', { pragma: 'h', pragmaFrag: '"span"' }],
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      }
    ]
  }
}
