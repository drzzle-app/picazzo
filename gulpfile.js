/* eslint no-console: 0 */
const gulp = require('gulp');
const path = require('path');
const prompt = require('gulp-prompt');
const fse = require('fs-extra');
const babel = require('gulp-babel');
const less = require('gulp-less');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const aliases = require('gulp-style-aliases');
const minify = require('gulp-minify');
const cssmin = require('gulp-cssmin');
const inject = require('gulp-inject-string');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const colors = require('colors');
const _ = require('lodash');

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

// callback to get folders in a directory
function getFiles(srcpath) {
  return fse
    .readdirSync(srcpath)
    .filter(file => !fse.statSync(path.join(srcpath, file)).isDirectory());
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
        console.log(colors.green(`Successfully built ${colors.blue('routes')}!`));
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
            'Enter path in pages folder you want this page in.\x1b[33m Default is /. Type [/some-page/some-other-page]',
        },
        {
          type: 'input',
          name: 'pageSize',
          message:
            'Will this page be a full page or does it need the sidebar layout?\x1b[33m Default is sidebar. Type [full/sidebar]',
          validate(input) {
            const inp = input.toLowerCase();
            if (inp !== 'full' && inp !== 'sidebar' && inp !== '') {
              console.log(colors.yellow('invalid answer'));
              return false;
            }
            return true;
          },
        },
      ],
      async (res) => {
        // build new page contents in the pages dir
        const p = res.pagePath.trim();
        const pagePath = p === '' || p === '/' ? '' : p;
        const route = `${res.pageName.replace(/ /g, '-')}`.trim().toLowerCase();
        const title = toTitleCase(res.pageName);
        const fullPagePath = `./src/pages${pagePath}/${route}`;

        // make component and template
        await fse.ensureDir(fullPagePath);
        fse
          .outputFile(`${fullPagePath}/template.html`, `<div>\n ${title} Page!\n</div>`)
          .then(() => fse.readFile(`${fullPagePath}/template.html`, 'utf8'))
          .catch(err => console.error(err));
        fse
          .outputFile(
            `${fullPagePath}/index.js`,
            `import Vue from 'vue';\n\nconst template = require('./template.html');\n\nexport default Vue.component('${route}-page', {\n  template,\n  name: '${route}-page',\n});\n`)
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
                console.log(colors.green('Successfully built new page!: '), colors.blue(page));
              })
              .catch(er => console.log(colors.red(er)));
          } else {
            console.log(colors.yellow(`There is already a ${name} page with the name: ${route}. Please try again.`));
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
        let msg = `Successfully built ${colors.gray('search data')}!`;
        if (error) {
          msg = error;
        }
        return console.log(colors.green(msg));
      });
    })
    .catch((error) => {
      console.log(colors.red('There was an issue creating pages.json: '), error);
    });
};

const buildModules = async () => {
  await fse.copy('./src/js-lib/modules', './dist/js/modules', { overwrite: true });
};

const bundleJs = async () =>
  new Promise((resolve, reject) =>
    gulp.src([
      './dist/js/modules/jquery-2.2.4.min.js',
      './dist/js/modules/jquery.mobile.custom.min.js',
      './dist/js/picazzo.droplet.lib.min.js',
    ]).pipe(concat('picazzo.bundle.min.js'))
      .pipe(gulp.dest('./dist/js/'))
      .on('end', () => {
        console.log(colors.green('Successfully bundled Picazzo js!'));
        resolve();
      })
      .on('end', () => reject()));

const buildJsPluginsSeperate = async () => {
  const dropletsPath = './src/droplets/';
  const toolsPath = './src/tools/';
  const droplets = getFolders(dropletsPath).filter(folder => fse.existsSync(`${dropletsPath}${folder}/plugin.js`));
  const tools = getFolders(toolsPath).filter(folder => fse.existsSync(`${toolsPath}${folder}/plugin.js`));

  function compress(p, f, t) {
    const jsFile = !f.match(/picazzo\.global\.js/gi) ? '/plugin.js' : '';
    const name = t === 'global' ? 'picazzo.globals' : f;
    return new Promise((resolve, reject) => {
      gulp
        .src(`${p}${f}${jsFile}`)
        .pipe(
          babel({
            presets: ['env'],
          }))
        .pipe(
          minify({
            noSource: true,
            ext: {
              min: [/picazzo\.global\.js|plugin\.js$/, `${name}.min.js`],
            },
          }))
        .pipe(gulp.dest(`./dist/js/${t}s/`))
        .on('end', () => {
          console.log(colors.green(`Successfully built ${colors.white(f)} js plugin!`));
          resolve();
        })
        .on('error', () => {
          reject();
        });
    });
  }
  // build droplets
  await Promise.all(droplets.map(file => compress(dropletsPath, file, 'droplet')));
  // build tools
  await Promise.all(tools.map(file => compress(toolsPath, file, 'tool')));
  // run the globals also
  await compress('./src/js-lib/', 'picazzo.global.js', 'global');
};

const buildJsPlugins = async () => {
  // grab all droplets and tools with JS plugins
  const plugins = ['./src/js-lib/picazzo.global.js'];
  const dropletsPath = './src/droplets/';
  const toolsPath = './src/tools/';
  const droplets = getFolders(dropletsPath)
    .filter(folder => fse.existsSync(`${dropletsPath}${folder}/plugin.js`))
    .map(name => ({ type: 'droplet', name }));
  const tools = getFolders(toolsPath)
    .filter(folder => fse.existsSync(`${toolsPath}${folder}/plugin.js`))
    .map(name => ({ type: 'tool', name }));
  const all = plugins.concat(
    droplets.concat(tools).map(item => `./src/${item.type}s/${item.name}/plugin.js`),
  );

  return new Promise((resolve, reject) => {
    gulp
      .src(all)
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
        console.log(colors.green('Successfully built Picazzo javascript library!'));
        resolve();
      })
      .on('error', () => reject());
  });
};

const newDroplet = type =>
  gulp.src(`./src/${type}s`).pipe(
    prompt.prompt(
      [
        {
          type: 'input',
          name: `${type}Name`,
          message: `${_.startCase(type)} Name?`,
          validate(input) {
            const inp = input.toLowerCase().trim();
            if (inp === '') {
              console.log(colors.yellow('Invalid answer, you must specify a name.'));
              return false;
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'needsJS',
          message: `Does this ${type} need a js plugin?. \x1b[33m Default n. Type [y/n]`,
          validate(input) {
            const inp = input.toLowerCase();
            if (inp !== 'y' && inp !== 'n' && inp !== '') {
              console.log(colors.yellow('invalid answer'));
              return false;
            }
            return true;
          },
        },
      ],
      (res) => {
        const name = `${res[`${type}Name`].replace(/ /g, '-')}`.trim().toLowerCase();
        const dropletDir = `./src/${type}s/${name}`;
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
              .pipe(replace('droplet-name', `${name}-${type}`))
              .pipe(replace('dropletName', jsName))
              .pipe(rename({
                basename: 'index',
              }))
              .pipe(gulp.dest(`${dropletDir}/`));

            // add droplet to all droplets file
            if (type === 'droplet') {
              const dropletsPageDir = './src/pages/all-droplets/';
              gulp.src(`${dropletsPageDir}all-droplets.js`)
                .pipe(replace('};', `  '${name}': require('@/droplets/${name}'),\n};`))
                .pipe(gulp.dest(dropletsPageDir));
            }

            // add all themes to this droplet. users can remove them if not wanted
            const themePath = './src/less/themes/';
            const themes = getFolders(themePath);
            themes.forEach((theme) => {
              fse.ensureDir(`${dropletDir}/themes/${theme}`).then(() => {
                // write file here
                fse.outputFile(`${dropletDir}/themes/${theme}/styles.less`, `// ${name} styles here\n`)
                  .then(() => {
                    fse.readFile(`${dropletDir}/themes/${theme}/styles.less`, 'utf8');
                    // finally add droplet less to each themes's main.less file and voila! done!
                    fse.appendFile(`./src/less/themes/${theme}/${type}s.less`,
                      `@import '../../../${type}s/${name}/themes/${theme}/styles';\n`,
                      (err) => {
                        if (err) {
                          console.log(colors.red(`There was an issue appending ${name} to droplets.less`));
                        }
                      });
                  })
                  .catch(err => console.error(err));
              }).catch(err => console.error(err));
            });
          })
          .catch(err => console.error(err));
      }));

const buildOverrides = () => new Promise((resolve, reject) => {
  gulp.src('./src/less/overrides/main.less')
    .pipe(less())
    .pipe(postcss([autoprefixer({
      grid: 'autoplace',
      cascade: false,
    })]))
    .pipe(rename('overrides.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(rename('overrides.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css'))
    .pipe(gulp.dest('./static/css'))
    .on('end', () => {
      console.log(colors.green('Successfully built overrides'));
      resolve();
    })
    .on('error', () => reject());
});

const buildThemes = async () => {
  const fontImports = [
    '@import "../fonts/source-sans-pro/source-sans-pro.css";',
    '@import "../icons/css/animation.min.css";',
    '@import "../icons/css/drzzle-embedded.min.css";',
    '@import "../icons/css/drzzle-ie7-codes.min.css";',
    '@import "../icons/css/drzzle-ie7.min.css";',
    '@import "../icons/css/drzzle.min.css";',
  ];
  function buildTheme(theme) {
    return new Promise((resolve, reject) => {
      const css = gulp
        .src(`./src/less/themes/${theme}/main.less`)
        .pipe(aliases(gulpAliases))
        .pipe(less())
        .pipe(postcss([autoprefixer({
          grid: 'autoplace',
          cascade: false,
        })]));
      css.pipe(inject.prepend(fontImports.join('').trim()))
        .pipe(rename(`${theme}.css`))
        .pipe(gulp.dest('./dist/css'));
      css.pipe(rename(`${theme}.min.css`))
        .pipe(cssmin())
        .pipe(inject.prepend(fontImports.join('').trim()))
        .pipe(gulp.dest('./dist/css'))
        .pipe(gulp.dest('./static/css'))
        .on('end', () => {
          console.log(colors.green('Successfully built theme: '), colors.rainbow(_.startCase(theme)));
          resolve(theme);
        })
        .on('error', () => reject());
    });
  }

  // get all themes in themes/ directory and build them
  const themesPath = './src/less/themes/';
  const themes = getFolders(themesPath).filter(theme => fse.existsSync(`${themesPath}${theme}/main.less`));

  await Promise.all(themes.map(theme => buildTheme(theme)));

  const now = new Date();
  // we use this so webpack can hot reload when we edit any theme
  let themeList = '[';
  themes.forEach((th, i) => {
    const tail = i === themes.length - 1 ? '' : ',';
    themeList += `'${th}'${tail}`;
  });
  themeList += ']';
  await fse.outputFile('./src/theme-reload.js',
    `/* eslint-disable */\n// this file is auto generated, do not edit it manually\n// last edited on ${now.toISOString()}\nmodule.exports = {\n themes: ${themeList}\n}`);
};

const buildIcons = async () => {
  const iconDir = './src/icons/css/';
  const cssFiles = getFiles(iconDir);

  await Promise.all(_.map(cssFiles, (iconCss) => {
    const fullPath = `${iconDir}${iconCss}`;
    const name = path.basename(iconCss, '.css');
    return new Promise((resolve, reject) => {
      // fontello css is already minified. trying
      // to minify again causes some of the files
      // erase a lot of code
      gulp.src(fullPath)
        .pipe(rename(`${name}.min.css`))
        .pipe(postcss([autoprefixer({
          cascade: false,
        })]))
        .pipe(gulp.dest('dist/icons/css'))
        .on('end', () => resolve(iconCss))
        .on('error', () => reject());
    });
  }));

  // copy font files into dist
  await fse.copy('./src/icons/font', './dist/icons/font', { overwrite: true });
  // copy font files into static
  await fse.copy('./dist/icons', './static/icons', { overwrite: true });

  console.log(colors.green(`Successfully built ${colors.magenta('icons')}!`));
};

const buildFonts = async () => {
  // copy font files into dist
  await fse.copy('./src/fonts', './dist/fonts', { overwrite: true });
  // copy font files into static
  await fse.copy('./src/fonts', './static/fonts', { overwrite: true });

  console.log(colors.green(`Successfully built ${colors.cyan('fonts')}!`));
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
              console.log(colors.yellow('Invalid answer, you must specify a name.'));
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
                  console.log(colors.green(`Successfully created "${name}" droplet: ${droplet}`));
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
  await buildModules();
  await buildJsPlugins();
  await buildJsPluginsSeperate();
  await buildSearch();
  await buildRoutes();
  await buildFonts();
  await buildIcons();
  await buildOverrides();
  await buildThemes();
  await bundleJs();
};

gulp.task('new-theme', newTheme);
gulp.task('new-page', newPage);
gulp.task('new-droplet', () => newDroplet('droplet'));
gulp.task('new-tool', () => newDroplet('tool'));
gulp.task('build-search', buildSearch);
gulp.task('build-routes', buildRoutes);
gulp.task('bundle-js', bundleJs);
gulp.task('build-js-plugins', buildJsPlugins);
gulp.task('build-js-separate', buildJsPluginsSeperate);
gulp.task('build-icons', buildIcons);
gulp.task('build-fonts', buildFonts);
gulp.task('build-overrides', buildOverrides);
gulp.task('build-themes', buildThemes);
gulp.task('build', buildAll);

// kick off default
gulp.task('default', ['build-js-plugins', 'build-search', 'build-routes', 'build-themes', 'build-icons'], () => {
  watch(['./src/js-lib/picazzo.global.js', './src/droplets/**/plugin.js', './src/tools/**/plugin.js'], () => buildJsPlugins());
  watch(['./src/pages/**/template.html', './src/droplets/**/template.html', './src/tools/**/template.html'], () => buildSearch());
  watch(['./src/router/routes.json'], () => buildRoutes());
  watch(['./src/icons/**/*'], () => buildIcons());
  watch(['./src/fonts/**/*'], () => buildFonts());
  watch(
    ['./src/droplets/**/*.less', './src/tools/**/*.less', './src/less/themes/**/*.less', './src/less/theme-globals/*.less'],
    () => buildThemes());
});
