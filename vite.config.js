import path from 'path'

export default {
  root: path.resolve(__dirname, './src/'),
  build: {
    outDir: path.resolve(__dirname, './docs'),
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, './src/home/home.html'),
        edit: path.resolve(__dirname, './src/edit/edit.html'),
        copy: path.resolve(__dirname, './src/copy.html')
      }
    }
  }
}