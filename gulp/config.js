var dest = 'build';

module.exports = {
  copyStatic: {
    src: 'src/index.html',
    dst: dest
  },
  css: {
    src: 'src/blocks/**/*.css',
    concatSrc: 'index.css',
    browsers: ['last 2 versions'],
    cascade: false,
    dest: dest + '/css'
  },
  browserify: {
    debug: true,
    extensions: ['.js'],
    bundleConfigs: [{
      entries: __dirname + '/../src/js/app.js',
      dest: dest,
      outputName: 'js/app.min.js'
    }]
  }
}