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
                ip: mkpath("ip"),
                //
                main: mkpath('.'),
                home: mkpath('home'),
                edit: mkpath('edit'),
                how: mkpath('edit/how'),
                wizard: mkpath('edit/how/wizard'),
                comment: mkpath('edit/comment'),
            }
        },
        outDir: '../dist',
    }
}

