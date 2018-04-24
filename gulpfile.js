const gulp = require('gulp');
const path = require('path');
const prompt = require('gulp-prompt');
const fse = require('fs-extra');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const concat = require('gulp-concat');

// utils
// callback to get folders in a directory
function getFolders(srcpath) {
  return fse.readdirSync(srcpath)
    .filter(file => fse.statSync(path.join(srcpath, file)).isDirectory());
}

const newPage = () => {
  const pageFile = './src/pages.json';
  fse.readJson(pageFile, function(err, data) {
    const list = JSON.parse(JSON.stringify(data, null, 4));
    list.pages.push({
      name: 'newPage',
      desc: 'someDesc'
    });
    fse.writeJson(pageFile, list, err => {
    if (err) return console.error(err)
      console.log('success update pages json!')
    })
  })
};

const buildJsPlugins = () => {
  // grab all patterns with JS
  const patternJS = ['./src/js-lib/flux.global.js'];
  const patterns = getFolders('./src/patterns/');
  const chain = [];
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const jsPath = `./src/patterns/${pattern}/plugin.js`;
    chain.push(
      new Promise((resolve, reject) => {
        try {
          // if there is a js file, add it to the concat list!
          fse.statSync(jsPath);
          patternJS.push(jsPath);
          console.log(patternJS);
          resolve(jsPath);
        } catch (e) {
          reject(undefined);
        }
      })
    )
  }
  Promise.all(chain).catch(() => {
    console.log('one or more pattern does not have js, but that is OK!');
  });
  // finally, run the concating
  return gulp.src(patternJS)
  .pipe(concat('flux.pattern.lib.js'))
  .pipe(babel({
    presets: ['env'],
  }))
  .pipe(minify({
    ext: {
      min: '.min.js',
    },
  }))
  .pipe(gulp.dest('./dist/js/'))
  .on('end', () => {
    console.log('\x1b[32m Successfully built flux pattern javascript library!');
  });
}


gulp.task('new-page', newPage);
gulp.task('build-js-plugins', buildJsPlugins);
