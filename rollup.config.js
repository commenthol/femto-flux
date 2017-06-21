import resolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'src/index.js',
  format: 'es',
  plugins: [
    resolve()
  ],
  dest: 'index.es5.js'
}
