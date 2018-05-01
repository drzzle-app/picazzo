/* eslint no-console: 0 */
const gulp = require('gulp');
const path = require('path');
const prompt = require('gulp-prompt');
const fse = require('fs-extra');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const watch = require('gulp-watch');

// utils
// callback to get folders in a directory
function getFolders(srcpath) {
  return fse
    .readdirSync(srcpath)
    .filter(file => fse.statSync(path.join(srcpath, file)).isDirectory());
}

// title case words
function toTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

const newPage = () => {
  // return gulp.src('./src/pages.json')
  //   .pipe(prompt.prompt([{
  //     type: 'input',
  //     name: 'pageName',
  //     message: 'Page Name?',
  //   },
  //   {
  //     type: 'input',
  //     name: 'sidebar',
  //     message: 'Will this page needa link in the sidebar? [y/n]',
  //   }], (res) => {
  //     console.log(res);
  //   }));
  const pageFile = './src/pages.json';
  fse.readJson(pageFile, (err, data) => {
    let list = JSON.parse(JSON.stringify(data));
    list.pages.push({
      name: 'newPage',
      desc: 'someDesc',
    });
    list = JSON.stringify(list, null, 2);
    fse.writeFile(pageFile, list, (error) => {
      let msg = 'Successfully updated pages json!';
      if (error) {
        msg = error;
      }
      return console.log(msg);
    });
  });
};

const buildSearch = () => {
  //
  const output = {
    pages: [],
  };
  const chain = [];
  // go find all tempplate files
  function recursiveFileSearch(startPath) {
    const files = fse.readdirSync(startPath);
    files.forEach((file) => {
      chain.push(
        new Promise((resolve) => {
          const filename = path.join(startPath, file);
          const stat = fse.lstatSync(filename);
          if (stat.isDirectory()) {
            recursiveFileSearch(filename);
            resolve(undefined);
          } else if (filename.match(/template\.html/gi)) {
            const route = path
              .dirname(filename)
              .split('/')
              .pop();
            const title = route.replace(/-/g, ' ');
            // get info for page obj from dir
            fse.readFile(filename, 'utf8', (err, data) => {
              const text = data.replace(/<\/?[^>]+(>|$)/g, '').trim();
              const page = {
                title: toTitleCase(title),
                route: `/${route.toLowerCase()}`,
                text,
              };
              output.pages.push(page);
              resolve(page);
            });
          } else {
            resolve(undefined);
          }
        }),
      );
    });
  }
  recursiveFileSearch('./src/pages');
  // after this make the json pages json file
  Promise.all(chain).then(() => {
    console.log(JSON.stringify(output, null, 4));
  });
};

const buildJsPlugins = () => {
  // grab all patterns with JS
  const patternJS = ['./src/js-lib/flux.global.js'];
  const patterns = getFolders('./src/patterns/');
  const chain = [];
  // start build
  patterns.forEach((pattern) => {
    const jsPath = `./src/patterns/${pattern}/plugin.js`;
    chain.push(
      new Promise((resolve, reject) => {
        try {
          // if there is a js file, add it to the concat list!
          fse.statSync(jsPath);
          patternJS.push(jsPath);
          console.log('pattern js files: ', patternJS);
          resolve(jsPath);
        } catch (e) {
          reject(undefined);
        }
      }),
    );
  });

  Promise.all(chain).catch(() => {
    console.log('one or more pattern does not have js, but that is OK!');
  });
  // finally, run the concating
  return gulp
    .src(patternJS)
    .pipe(concat('flux.pattern.lib.js'))
    .pipe(
      babel({
        presets: ['env'],
      }),
    )
    .pipe(
      minify({
        ext: {
          min: '.min.js',
        },
      }),
    )
    .pipe(gulp.dest('./dist/js/'))
    .on('end', () => {
      console.log('\x1b[32m Successfully built flux pattern javascript library!');
    });
};

gulp.task('new-page', newPage);
gulp.task('build-search', buildSearch);
gulp.task('build-js-plugins', buildJsPlugins);

// kick off default
gulp.task('default', ['build-js-plugins'], () => {
  watch(['./src/js-lib/flux.global.js', './src/patterns/**/plugin.js'], () => buildJsPlugins());
});
