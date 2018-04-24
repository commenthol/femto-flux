import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

process.env.BABEL_ENV = 'notThere'

// can't use .babelrc for the different envs - hence we define those here
const babelEnv = {
  'es5': {
    'presets': [
      [
        'env',
        {
          'modules': false
        }
      ],
      'stage-2'
    ]
  },
  'es6': {
    'presets': [
      [
        'env',
        {
          'modules': false,
          'targets': {
            'node': '6.0.0'
          }
        }
      ],
      'stage-2'
    ]
  }
}

const input = 'src/index.js'

const output = (type, min = '') => type === 'es6'
  ? [{
    file: `./dist/index.${type}${min}.js`,
    format: 'es'
  }]
  : [{
    file: `./dist/index.${type}${min}.js`,
    format: 'es'
  }, {
    file: `./dist/index${min}.js`,
    format: 'cjs',
    exports: 'named'
  }]

const builder = (type, min = '') => {
  const _babelOpts = {
    exclude: 'node_modules/**',
    runtimeHelpers: true,
    plugins: ['external-helpers'],
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
    output: output(type, min),
    plugins
  }
}

export default [
  builder('es5'),
  builder('es5', '.min'),
  builder('es6'),
  builder('es6', '.min')
]
