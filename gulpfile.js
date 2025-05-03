// gulpfile.js
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const fileInclude = require('gulp-file-include');

// Sass 編譯
gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
});

// HTML include
gulp.task('html', function () {
  return gulp.src(['src/html/pages/**/*.html'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('dist'));
});

// 複製圖片
gulp.task('images', function () {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('dist/img'));
});

// 複製 JS
gulp.task('js', function () {
  return gulp.src('src/js/**/*')
    .pipe(gulp.dest('dist/js'));
});

// 複製 library
gulp.task('library', function () {
  return gulp.src('src/library/**/*')
    .pipe(gulp.dest('dist/library'));
});

// 監看變化
gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('src/html/**/*.html', gulp.series('html'));
  gulp.watch('src/img/**/*', gulp.series('images'));
  gulp.watch('src/js/**/*', gulp.series('js'));
  gulp.watch('src/library/**/*', gulp.series('library'));
});

// 預設任務
gulp.task('default', gulp.series('sass', 'html', 'images', 'js', 'library', 'watch'));