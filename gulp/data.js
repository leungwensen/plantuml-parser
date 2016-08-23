const fs = require('fs');
const gulp = require('gulp');
const lang = require('zero-lang');
const path = require('path');

gulp.task('data', () => {
  fs.readdir(path.resolve(__dirname, '../spec/fixtures'), (err, files) => {
    if (err) throw err;
    fs.writeFile(
      path.resolve(__dirname, '../spec/fixtures.json'),
      JSON.stringify(lang.filter(files, (file) => /\.plantuml$/.test(file))),
      (e) => {
        if (e) throw e;
      }
    );
  });
});
