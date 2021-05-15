import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';

export default {
    input: './src/index.js',
    external: [
        'nanoid',
        'sham-ui',
        'sham-ui-macro/babel.macro',
        /@babel\/runtime/,
        /@corejs/
    ],
    output: [
        { file: pkg.main, format: 'cjs', exports: 'auto' },
        { file: pkg.module, format: 'es' }
    ],
    plugins: [
        babel( {
            exclude: [ 'node_modules/**' ],
            babelHelpers: 'inline'
        } )
    ]
};
