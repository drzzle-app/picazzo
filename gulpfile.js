const gulp = require('gulp');
const prompt = require('gulp-prompt');
const fse = require('fs-extra');

const newPage = () => {
  const pageFile = './src/pages.json';
  fse.readJson(pageFile, function(err, data) {
    const list = JSON.parse(JSON.stringify(data, null, 4));
    list.pages.push({
      name: 'newPage',
      desc: 'someDesc'
    });
    console.log(list);
    // fse.writeJson(pageFile, list, err => {
    // if (err) return console.error(err)
    //   console.log('success!')
    // })
  })
  // let pageName = '';
  // gulp.src('./src/pages.json')
  // prompt for name and descrption and where they want it
};

gulp.task('new-page', newPage);

// gulp.task('build-js-modules', jsNodeModulesTask);
// gulp.task('build-dist', buildDist);