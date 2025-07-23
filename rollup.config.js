import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';

export default defineConfig([
    // Main build
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: 'dist/index.esm.js',
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            resolve({
                browser: true,
            }),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: false,
            }),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            }),
        ],
        external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            '@chakra-ui/react',
            '@emotion/react',
            '@emotion/styled',
            'framer-motion',
            'antd',
        ],
    },
    // Type definitions
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'es',
        },
        plugins: [dts()],
        external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            '@chakra-ui/react',
            '@emotion/react',
            '@emotion/styled',
            'framer-motion',
            'antd',
        ],
    },
]);
