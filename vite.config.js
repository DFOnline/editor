import path from 'path'

export default {
  root: path.resolve(__dirname, './src/'),
  build: {
    outDir: path.resolve(__dirname, './docs'),
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, './src/index.html'),
        home: path.resolve(__dirname, './src/home/index.html'),
        edit: path.resolve(__dirname, './src/edit/index.html'),
        copy: path.resolve(__dirname, './src/copy.html'),
        comment: path.resolve(__dirname, './src/edit/comment.html')
      }
    }
  }
}