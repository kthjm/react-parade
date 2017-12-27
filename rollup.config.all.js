const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const flow = require('rollup-plugin-flow')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const { minify } = require('uglify-es')

const input = `src/index.js`
const file = mid => `dist/${mid}.js`

const cjs_and_es = () =>
  rollup({
    input,
    plugins: [flow(), babel({ exclude: 'node_modules/**' }), commonjs()]
  }).then(bundle => {
    bundle.write({ format: 'cjs', file: file('cjs') })
    bundle.write({ format: 'es', file: file('es') })
  })

const umd = () =>
  rollup({
    input,
    plugins: [
      flow(),
      babel({ exclude: 'node_modules/**' }),
      commonjs(),
      uglify({}, minify)
    ]
  }).then(bundle =>
    bundle.write({
      format: 'umd',
      file: file('min'),
      name: 'ReactShut',
      globals: {
        react: 'React',
        atra: 'Atra'
      }
    })
  )

const build = () =>
  Promise.resolve()
    .then(cjs_and_es)
    .then(umd)
    .catch(err => console.error(err))

build()
