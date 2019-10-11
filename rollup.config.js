import path from 'path'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'
import sourceMaps from 'rollup-plugin-sourcemaps'

import pkg from './package.json'

const distPathGen = fragment => path.resolve(__dirname, 'dist', fragment)

export default {
  input: './src/index.ts',
  plugins: [
    replace({
      __VERSION__: pkg.version,
    }),

    typescript({
      exclude: 'node_modules/**',
      typescript: require('typescript'),
      useTsconfigDeclarationDir: true,
    }),
    json(),

    commonjs({
      include: 'node_modules/**',
    }),

    sourceMaps(),
  ],
  output: [
    {
      format: 'cjs',
      file: distPathGen(`${pkg.name}.js`),
      sourcemap: true,
    },
    {
      format: 'es',
      file: distPathGen(`${pkg.name}.es.js`),
      sourcemap: true,
    },
    {
      format: 'umd',
      name: 'Network',
      file: distPathGen(`${pkg.name}.umd.js`),
      sourcemap: true,
    },
  ],
}
