/* eslint no-console: 0 */
const gulp = require('gulp');
const path = require('path');
const prompt = require('gulp-prompt');
const fse = require('fs-extra');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const _ = require('lodash');

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

// prep json for outputting to js file
function filePrepJSON(list) {
  let newObj = '';
  function deepDig(arr) {
    _.forEach(arr, (v) => {
      newObj += '{ ';
      _.forOwn(v, (val, key) => {
        newObj += `${key}: `;
        if (_.isArray(val)) {
          newObj += '[';
          deepDig(val);
          newObj += '],';
        } else {
          newObj += val.match(/^require/gi) ? `${val}, ` : `'${val}', `;
        }
      });
      newObj += '},';
    });
  }
  deepDig(list);
  return `[ ${newObj} ]`;
}

const buildRoutes = () => {
  fse.readJson('./src/router/routes.json', (err, data) => {
    const contents = filePrepJSON(data.routes);
    // update routes js file first
    fse.outputFile('./src/router/routes.js', `/* eslint-disable */\n// This is a generated file, do not edit it directly\nmodule.exports = {\n routes: ${contents}\n};`)
      .then(() => {
        fse.readFile('./src/router/routes.js', 'utf8');
        console.log('\x1b[32m Generated routes');
      })
      .catch(er => console.error(er));
  });
};

const newPage = () => {
  const routeJSON = './src/router/routes.json';
  // const sideBarJSON = './src/side-bar.json';
  return gulp.src(routeJSON)
    .pipe(prompt.prompt([{
      type: 'input',
      name: 'pageName',
      message: 'Page Name?',
    },
    {
      type: 'input',
      name: 'pagePath',
      message: 'Enter path in page folder you want this page in.\x1b[33m Default is /. Type [/some-page/some-other-page]',
    },
    {
      type: 'input',
      name: 'pageSize',
      message: 'Will this page be a full page or does it need the sidebar layout?\x1b[33m Default is sidebar. Type [full/sidebar]',
      validate(input) {
        const inp = input.toLowerCase();
        if (inp !== 'full' && inp !== 'sidebar' && inp !== '') {
          console.log('\x1b[31m invalid answer');
          return false;
        }
        return true;
      },
    },
    // {
    //   type: 'input',
    //   name: 'sideBar',
    //   message: 'Will this page need a link in the sidebar?\x1b[33m Default is n. Type [y/n]',
    //   validate(input) {
    //     const inp = input.toLowerCase();
    //     if (inp !== 'y' && inp !== 'n' && inp !== '') {
    //       console.log('\x1b[31m invalid answer');
    //       return false;
    //     }
    //     return true;
    //   },
    // },
    ], (res) => {
      // build new page contents in the pages dir
      const pagePath = res.pagePath.trim() === '' ? '' : res.pagePath.trim();
      const route = `${res.pageName.replace(/ /g, '-')}`.trim().toLowerCase();
      const title = toTitleCase(res.pageName);
      const fullPagePath = `./src/pages${pagePath}/${route}`;

      // make component and template
      fse.outputFile(`${fullPagePath}/template.html`, `<div>\n ${title} Page!\n</div>`)
        .then(() => fse.readFile(`${fullPagePath}/template.html`, 'utf8'))
        .catch(err => console.error(err));
      fse.outputFile(`${fullPagePath}/index.js`, `import Vue from 'vue';\n\nconst template = require('./template.html');\n\nexport default Vue.component('${route}', {\n  template,\n  name: '${route}',\n});\n`)
        .then(() => fse.readFile(`${fullPagePath}/index.js`, 'utf8'))
        .catch(err => console.error(err));

      // build routes for new page
      fse.readJson(routeJSON, (err, data) => {
        let list = JSON.parse(JSON.stringify(data));
        const name = res.pageSize === '' ? 'sidebar' : res.pageSize;
        const type = _.find(list.routes, { name });
        // if there are no pages with that name taken, then proceed
        if (!_.find(type.children, { name: route })) {
          const page = {
            path: `/${route}`,
            name: route,
            component: `require('@/pages${pagePath}/${route}/').default`,
          };
          type.children.push(page);
          // update json file so it can fire off the new routes.js file
          list = JSON.stringify(list, null, 4);
          // regenerate json file
          fse.outputFile(routeJSON, list).then(() => {
            console.log('\x1b[32m Successfully built new page!: ', page);
          }).catch(er => console.log(er));
        } else {
          console.log(`\x1b[31m There is already a ${name} page with the name: ${route}. Please try again.`);
        }
      });

      // @TODO build side-bar-links ?
      // need to find what children to inject to
      // also need a solution if links serve as dropdowns AND a link
      // this may be better off being a manual step
    }));
};

const buildSearch = () => {
  const output = {
    pages: [],
  };
  const chain = [];
  // go find all tempplate files in the pages folder
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
        }));
    });
  }
  // kick off the recursion
  recursiveFileSearch('./src/pages');
  // after this make the json pages.json file again
  Promise.all(chain).then(() => {
    fse.writeFile('./src/pages.json', JSON.stringify(output, null, 4), (error) => {
      let msg = '\x1b[32m Successfully built search data!';
      if (error) {
        msg = error;
      }
      return console.log(msg);
    });
  }).catch((error) => {
    console.log('There was an issue creating pages.json: ', error);
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
      }));
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
      }))
    .pipe(
      minify({
        ext: {
          min: '.min.js',
        },
      }))
    .pipe(gulp.dest('./dist/js/'))
    .on('end', () => {
      console.log('\x1b[32m Successfully built flux pattern javascript library!');
    });
};

const newPattern = () =>
  gulp.src('./src/patterns/*')
    .pipe(prompt.prompt([{
      type: 'input',
      name: 'patternName',
      message: 'Pattern Name?',
      validate(input) {
        const inp = input.toLowerCase().trim();
        if (inp === '') {
          console.log('\x1b[31m Invalid answer, you must specify a name.');
          return false;
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'needsJS',
      message: 'Does this pattern need a js plugin?. \x1b[33m Default n. Type [y/n]',
      validate(input) {
        const inp = input.toLowerCase();
        if (inp !== 'y' && inp !== 'n' && inp !== '') {
          console.log('\x1b[31m invalid answer');
          return false;
        }
        return true;
      },
    },
    ], (res) => {
      console.log('user input: ', res);
    }));

gulp.task('new-page', newPage);
gulp.task('new-pattern', newPattern);
gulp.task('build-search', buildSearch);
gulp.task('build-routes', buildRoutes);
gulp.task('build-js-plugins', buildJsPlugins);

// kick off default
gulp.task('default', ['build-js-plugins', 'build-search', 'build-routes'], () => {
  watch(['./src/js-lib/flux.global.js', './src/patterns/**/plugin.js'], () => buildJsPlugins());
  watch(['./src/pages/**/template.html'], () => buildSearch());
  watch(['./src/router/routes.json'], () => buildRoutes());
});
