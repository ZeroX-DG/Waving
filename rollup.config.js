import typescript from 'rollup-plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy-assets';

export default {
  input: './src/index.ts',
  output: {
    name: 'Waving',
    file: 'dist/waving.js',
    format: 'umd'
  },
  plugins: [
    typescript(),
    postcss({ plugins: [], extract: true }),
    copy({
      assets: ['./src/icons/fonts']
    })
  ]
};
