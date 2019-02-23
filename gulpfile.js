/* eslint no-console: 0 */
const gulp = require('gulp');
const path = require('path');
const prompt = require('gulp-prompt');
const fse = require('fs-extra');
const babel = require('gulp-babel');
const less = require('gulp-less');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const autoprefixer = require('gulp-autoprefixer');
const aliases = require('gulp-style-aliases');
const minify = require('gulp-minify');
const cssmin = require('gulp-cssmin');
const inject = require('gulp-inject-string');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const _ = require('lodash');

// utils

// gulp file aliases
const gulpAliases = {
  '@modules': './node_modules',
  '@droplets': './src/droplets',
  '@theme-globals': './src/less/theme-globals',
  '@icons': './src/icons',
};

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

// preparing a complex camelCase name for JS files
function prepJsName(n) {
  let jsNameSplit = n;
  if (n.match(/-/gi)) {
    jsNameSplit = jsNameSplit.split('-');
    let jsNewName = jsNameSplit[0].toString();
    jsNameSplit.forEach((word, i) => {
      if (i !== 0) {
        const camelCase = word
          .charAt(0)
          .toUpperCase() + word.slice(1);
        jsNewName += camelCase;
      }
    });
    jsNameSplit = jsNewName;
  }
  return jsNameSplit;
}

const buildRoutes = () => {
  fse.readJson('./src/router/routes.json', (err, data) => {
    const contents = filePrepJSON(data.routes);
    // update routes js file first
    fse
      .outputFile(
        './src/router/routes.js',
        `/* eslint-disable */\n// This is a generated file, do not edit it directly\nmodule.exports = {\n routes: ${contents}\n};`)
      .then(() => {
        fse.readFile('./src/router/routes.js', 'utf8');
        console.log('\x1b[32m Generated routes');
      })
      .catch(er => console.error(er));
  });
};

const newPage = () => {
  const routeJSON = './src/router/routes.json';
  return gulp.src(routeJSON).pipe(
    prompt.prompt(
      [
        {
          type: 'input',
          name: 'pageName',
          message: 'Page Name?',
        },
        {
          type: 'input',
          name: 'pagePath',
          message:
            'Enter path in page folder you want this page in.\x1b[33m Default is /. Type [/some-page/some-other-page]',
        },
        {
          type: 'input',
          name: 'pageSize',
          message:
            'Will this page be a full page or does it need the sidebar layout?\x1b[33m Default is sidebar. Type [full/sidebar]',
          validate(input) {
            const inp = input.toLowerCase();
            if (inp !== 'full' && inp !== 'sidebar' && inp !== '') {
              console.log('\x1b[31m invalid answer');
              return false;
            }
            return true;
          },
        },
      ],
      (res) => {
        // build new page contents in the pages dir
        const pagePath = res.pagePath.trim() === '' ? '' : res.pagePath.trim();
        const route = `${res.pageName.replace(/ /g, '-')}`.trim().toLowerCase();
        const title = toTitleCase(res.pageName);
        const fullPagePath = `./src/pages${pagePath}/${route}`;

        // make component and template
        fse
          .outputFile(`${fullPagePath}/template.html`, `<div>\n ${title} Page!\n</div>`)
          .then(() => fse.readFile(`${fullPagePath}/template.html`, 'utf8'))
          .catch(err => console.error(err));
        fse
          .outputFile(
            `${fullPagePath}/index.js`,
            `import Vue from 'vue';\n\nconst template = require('./template.html');\n\nexport default Vue.component('${route}', {\n  template,\n  name: '${route}',\n});\n`)
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
            fse
              .outputFile(routeJSON, list)
              .then(() => {
                console.log('\x1b[32m Successfully built new page!: ', page);
              })
              .catch(er => console.log(er));
          } else {
            console.log(`\x1b[31m There is already a ${name} page with the name: ${route}. Please try again.`);
          }
        });
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
              let text = data.replace(/<\/?[^>]+(>|$)/g, '').trim();
              text = text.replace(/{{([^{}]+)}}/g, '$1');
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
  Promise.all(chain)
    .then(() => {
      fse.writeFile('./src/pages.json', JSON.stringify(output, null, 4), (error) => {
        let msg = '\x1b[32m Successfully built search data!';
        if (error) {
          msg = error;
        }
        return console.log(msg);
      });
    })
    .catch((error) => {
      console.log('There was an issue creating pages.json: ', error);
    });
};

const buildJsPluginsSeperate = () => {
  const dropletsPath = './src/droplets/';
  const files = getFolders(dropletsPath);

  function compress(p, f) {
    const jsFile = !f.match(/picazzo\.global\.js/gi) ? '/plugin.js' : '';
    return gulp
      .src(`${p}${f}${jsFile}`)
      .pipe(
        babel({
          presets: ['env'],
        }))
      .pipe(
        minify({
          noSource: true,
          ext: {
            min: [/picazzo\.global\.js|plugin\.js$/, `${f}.min.js`],
          },
        }))
      .pipe(gulp.dest('./dist/js/droplets/'))
      .on('end', () => {
        console.log(`\x1b[32m Successfully built "${f}" js plugin!`);
      });
  }

  files.forEach(file => compress(dropletsPath, file));
  // run the globals also
  compress('./src/js-lib/', 'picazzo.global.js');
};

const buildJsPlugins = () => {
  // grab all droplets with JS
  const dropletJS = ['./src/js-lib/picazzo.global.js'];
  const droplets = getFolders('./src/droplets/');
  const chain = [];
  // start build
  droplets.forEach((droplet) => {
    const jsPath = `./src/droplets/${droplet}/plugin.js`;
    chain.push(
      new Promise((resolve, reject) => {
        try {
          // if there is a js file, add it to the concat list!
          fse.statSync(jsPath);
          dropletJS.push(jsPath);
          console.log('droplet js files: ', dropletJS);
          resolve(jsPath);
        } catch (e) {
          reject(undefined);
        }
      }));
  });

  Promise.all(chain).catch(() => {
    console.log('one or more droplets does not have js, but that is OK!');
  });
  // finally, run the concating
  return gulp
    .src(dropletJS)
    .pipe(concat('picazzo.droplet.lib.js'))
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
      console.log('\x1b[32m Successfully built picazzo droplet javascript library!');
    });
};

const newDroplet = () =>
  gulp.src('./src/droplets/*').pipe(
    prompt.prompt(
      [
        {
          type: 'input',
          name: 'dropletName',
          message: 'Droplet Name?',
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
          message: 'Does this droplet need a js plugin?. \x1b[33m Default n. Type [y/n]',
          validate(input) {
            const inp = input.toLowerCase();
            if (inp !== 'y' && inp !== 'n' && inp !== '') {
              console.log('\x1b[31m invalid answer');
              return false;
            }
            return true;
          },
        },
      ],
      (res) => {
        const name = `${res.dropletName.replace(/ /g, '-')}`.trim().toLowerCase();
        const dropletDir = `./src/droplets/${name}`;
        let ref = '';
        let jsName = '';
        let scaffIndexJs = './scaffholds/newDropletIndex.js';
        // create the new droplet dir
        fse.ensureDir(dropletDir)
          .then(() => {
            // if droplet needs js, add the needed things
            if (res.needsJS === 'y') {
              jsName = prepJsName(name);
              ref = ` ref="${jsName}"`;
              scaffIndexJs = './scaffholds/newDropletIndex-plugin.js';
              // copy scaffhold js file but replace "newDroplet" with new name
              gulp.src('./scaffholds/newPlugin.js')
                .pipe(replace('dropletName', jsName))
                .pipe(rename({
                  basename: 'plugin',
                }))
                .pipe(gulp.dest(`${dropletDir}/`));
            }

            // proceed with creating the template file
            fse.outputFile(`${dropletDir}/template.html`, `<div${ref}>\n ${name}\n</div>`)
              .then(() => fse.readFile(`${dropletDir}/template.html`, 'utf8'))
              .catch(err => console.error(err));

            // create index.js for vue
            gulp.src(scaffIndexJs)
              .pipe(replace('droplet-name', name))
              .pipe(replace('dropletName', jsName))
              .pipe(rename({
                basename: 'index',
              }))
              .pipe(gulp.dest(`${dropletDir}/`));

            // add all themes to this plugin. users can remove them if not wanted
            const themePath = './src/less/themes/';
            const themes = getFolders(themePath);
            themes.forEach((theme) => {
              fse.ensureDir(`${dropletDir}/themes/${theme}`).then(() => {
                // write file here
                fse.outputFile(`${dropletDir}/themes/${theme}/styles.less`, `// ${name} styles here\n`)
                  .then(() => {
                    fse.readFile(`${dropletDir}/themes/${theme}/styles.less`, 'utf8');
                    // finally add droplet less to each themes's main.less file and voila! done!
                    fse.appendFile(`./src/less/themes/${theme}/droplets.less`,
                      `@import '../../../droplets/${name}/themes/${theme}/styles';\n`,
                      (err) => {
                        if (err) {
                          console.log(`There was an issue appending ${name} to droplets.less`);
                        }
                      });
                  })
                  .catch(err => console.error(err));
              }).catch(err => console.log(err));
            });
          })
          .catch(err => console.error(err));
      }));

const buildThemes = () => {
  const fontelloImports = [
    '@import "icons/css/animation.min.css";',
    '@import "icons/css/drzzle-embedded.min.css";',
    '@import "icons/css/drzzle-ie7-codes.min.css";',
    '@import "icons/css/drzzle-ie7.min.css";',
    '@import "icons/css/drzzle.min.css";',
  ];
  function buildTheme(theme) {
    return gulp
      .src(`./src/less/themes/${theme}/main.less`)
      .pipe(aliases(gulpAliases))
      .pipe(less())
      .pipe(
        autoprefixer({
          browsers: ['last 5 versions'],
          cascade: false,
        }))
      .pipe(rename('main.min.css'))
      .pipe(cssmin())
      .pipe(inject.prepend(fontelloImports.join('').trim()))
      .pipe(gulp.dest(`./dist/css/themes/${theme}`))
      .pipe(gulp.dest(`./static/css/themes/${theme}`));
  }
  // get all themes in themes/ directory and build them
  const themePath = './src/less/themes/';
  const themes = getFolders(themePath);
  const themeChain = [];
  themes.forEach((theme) => {
    themeChain.push(
      new Promise((resolve, reject) => {
        fse.stat(`${themePath}${theme}/main.less`, (err) => {
          if (err == null) {
            // main.less file exists
            buildTheme(theme).on('end', () => {
              console.log(`\x1b[32m Successfully Built theme: \x1b[34m ${theme}`);
              resolve(theme);
            });
          } else if (err.code === 'ENOENT') {
            // main.less file does not exist
            console.log('\x1b[31m', `Error: No 'main.less' file for theme: \x1b[34m ${theme}`);
            reject(err);
          }
        });
      }));
  });
  Promise.all(themeChain).then((t) => {
    const now = new Date();
    // we use this so webpack can hot reload when we edit any theme
    let themeList = '[';
    t.forEach((th) => {
      themeList += `'${th}',`;
    });
    themeList += ']';
    fse.outputFile('./src/theme-reload.js',
      `/* eslint-disable */\n// this file is auto generated, do not edit it manually\n// last edited on ${now.toISOString()}\nmodule.exports = {\n themes: ${themeList}\n}`);
  }).catch(er => console.log(er));
};

const buildIcons = () => {
  const themeDistPath = './dist/css/themes/';
  const themes = getFolders(themeDistPath);
  const iconDir = './src/icons/css/';
  fse.readdir(iconDir, (err, cssFiles) => {
    if (err) {
      console.log(err);
      return;
    }

    const copyFontFiles = (fontDir, res) =>
      fse.copy('./src/icons/font', fontDir, { overwrite: true })
        .then(() => {
          if (res) {
            res(fontDir);
          }
        })
        // we need to resolve even if there is a no file error
        .catch(er => res(er));

    const iconChain = [];
    cssFiles.forEach((file) => {
      iconChain.push(
        new Promise((resolve) => {
          const fullPath = `${iconDir}${file}`;
          const name = path.basename(file, '.css');
          const pipeline = gulp.src(fullPath)
            .pipe(rename(`${name}.min.css`))
            .pipe(
              autoprefixer({
                browsers: ['last 10 versions'],
                cascade: false,
              }))
            .pipe(cssmin());
          // place all icon css files in all themes
          themes.forEach((theme, i) => {
            pipeline.pipe(gulp.dest(`${themeDistPath}${theme}/icons/css`));
            // copy the font files into each themes dist
            const fontDir = `${themeDistPath}${theme}/icons/font`;
            const last = i === themes.length - 1 ? resolve : false;
            fse.emptyDir(fontDir)
              .then(() => copyFontFiles(fontDir, last));
          });
        }));
    });
    Promise.all(iconChain).then(() => {
      // now copy dist to static
      fse.copy('./dist/css/themes', './static/css/themes', { overwrite: true })
        .then(() => console.log('\x1b[32m Successfully built icons'))
        .catch(er => console.log('recreating path: ', er.path));
    });
  });
};

const newTheme = () => {
  const defaultTheme = 'default';
  return gulp.src(`./src/less/themes/${defaultTheme}/**/*`).pipe(
    prompt.prompt(
      [
        {
          type: 'input',
          name: 'themeName',
          message: 'Theme Name?',
          validate(input) {
            const inp = input.toLowerCase().trim();
            if (inp === '') {
              console.log('\x1b[31m Invalid answer, you must specify a name.');
              return false;
            }
            return true;
          },
        },
      ],
      (res) => {
        const name = `${res.themeName.replace(/ /g, '-')}`.trim().toLowerCase();
        gulp.src(`./src/less/themes/${defaultTheme}/**/*`)
          // copy default theme
          .pipe(gulp.dest(`./src/less/themes/${name}`))
          .on('end', () => {
            const droplets = getFolders('./src/droplets/');
            droplets.forEach((droplet) => {
              gulp.src(`./src/droplets/${droplet}/themes/${defaultTheme}/**/*`)
                .pipe(gulp.dest(`./src/droplets/${droplet}/themes/${name}`))
                .on('end', () => {
                  console.log(`\x1b[32m Successfully created "${name}" droplet: \x1b[34m ${droplet}`);
                });
            });
            const newThemePath = `./src/less/themes/${name}/droplets.less`;
            gulp.src([newThemePath], { base: newThemePath })
              .pipe(replace(defaultTheme, name))
              .pipe(gulp.dest(newThemePath));
          });
      }));
};

const buildAll = async () => {
  await buildJsPlugins();
  await buildSearch();
  await buildRoutes();
  await buildIcons();
  await buildThemes();
};

gulp.task('new-theme', newTheme);
gulp.task('new-page', newPage);
gulp.task('new-droplet', newDroplet);
gulp.task('build-search', buildSearch);
gulp.task('build-routes', buildRoutes);
gulp.task('build-js-plugins', buildJsPlugins);
gulp.task('build-js-separate', buildJsPluginsSeperate);
gulp.task('build-icons', buildIcons);
gulp.task('build-themes', buildThemes);
gulp.task('build', buildAll);

// kick off default
gulp.task('default', ['build-js-plugins', 'build-search', 'build-routes', 'build-themes', 'build-icons'], () => {
  watch(['./src/js-lib/picazzo.global.js', './src/droplets/**/plugin.js'], () => buildJsPlugins());
  watch(['./src/pages/**/template.html', './src/droplets/**/template.html'], () => buildSearch());
  watch(['./src/router/routes.json'], () => buildRoutes());
  watch(['./src/icons/**/*'], () => buildIcons());
  watch(
    ['./src/droplets/**/*.less', './src/less/themes/**/*.less', './src/less/theme-globals/*.less'],
    () => buildThemes());
});
