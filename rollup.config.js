import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify-es'

process.env.BABEL_ENV = 'notThere'

// can't use .babelrc for the different envs - hence we define those here
const babelEnv = {
  es5: {
    presets: [
      [
        '@babel/env',
        {
          modules: false,
          targets: {
            node: '4.0.0'
          }
        }
      ]
    ]
  },
  es6: {
    presets: [
      [
        '@babel/env',
        {
          modules: false,
          targets: {
            node: '6.0.0'
          }
        }
      ]
    ]
  }
}

const output = (name, type, min = '') => type === 'es6'
  ? [{
    file: `./dist/${name}.${type}${min}.js`,
    format: 'es'
  }]
  : [{
    file: `./dist/${name}.${type}${min}.js`,
    format: 'es'
  }, {
    file: `./dist/${name}${min}.js`,
    format: 'cjs',
    exports: 'named'
  }]

const builder = (input, name, type, min = '') => {
  const _babelOpts = {
    exclude: 'node_modules/**',
    runtimeHelpers: true,
    presets: babelEnv[type].presets
  }
  const plugins = [
    babel(_babelOpts)
  ]
  if (min) {
    plugins.push(uglify({}))
  }

  return {
    input,
    output: output(name, type, min),
    plugins,
    external: ['react']
  }
}

export default [
  builder('src/index.js', 'index', 'es5'),
  builder('src/index.js', 'index', 'es5', '.min'),
  builder('src/index.js', 'index', 'es6'),
  builder('src/index.js', 'index', 'es6', '.min')
  // builder('src/container/Container.js', 'Container', 'es5', '', ''),
  // builder('src/container/FnComponent.js', 'FnComponent', 'es5', '', '')
]
