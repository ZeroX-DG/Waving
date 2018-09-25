import typescript from 'rollup-plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy-assets';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: './src/index.ts',
  output: {
    name: 'Waving',
    file: 'dist/waving.js',
    format: 'umd'
  },
  plugins: [
    typescript(),
    uglify(),
    postcss({ plugins: [], extract: true }),
    copy({
      assets: ['./src/icons/fonts']
    })
  ]
};
