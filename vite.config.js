// @ts-check
const root = './src';

import { resolve } from 'path';

/**
 * @param {string} dir le directory
 */
const mkpath = dir => resolve(root, `${dir}/index.html`);

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
                main: mkpath('.'),
                home: mkpath('home'),
                how: mkpath('edit/how'),
                edit: mkpath('edit'),
                comment: mkpath('edit/comment'),
            }
        },
        outDir: '../dist',
    }
}

