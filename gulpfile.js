const gulp = require('gulp');
const download = require('gulp-download2');
const del = require('del');

gulp.task('clean', function () {
    return del(['.nyc_output', 'coverage', 'vendor'])
});

gulp.task('dl', ['clean'], function () {
    return download([
        'http://www.convertcsv.com/strsup.js',
        'http://www.convertcsv.com/csvsup.js'
    ]).pipe(gulp.dest('vendor'));
});

gulp.task('tpl', function () {
    return gulp.src('./lib/vendor/*', { src: '.' })
        .pipe(gulp.dest('./vendor'));
});
