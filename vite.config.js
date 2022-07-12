// @ts-check
const root = './src';

import { resolve } from 'path';

/**
 * @type {import('vite').UserConfig}
 */
export default 
{
    root,
    server: {
        port: 1234,
    },
    preview: {
        port: 1234,
    },
    build: {
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(root,'index.html'),
                edit: resolve(root,'edit/index.html'),
                comment: resolve(root,'edit/comment/index.html'),
                how: resolve(root,'edit/how/index.html'),
                home: resolve(root,'home/index.html'),
            }
        },
        outDir: '../dist',
    }
}

