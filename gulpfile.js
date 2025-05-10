// gulpfile.js
const autoprefixer = require('gulp-autoprefixer').default;
const cleanCSS = require('gulp-clean-css');
const ejs = require('gulp-ejs');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const path = require('path');
const plumber = require('gulp-plumber');
const prettify = require('gulp-prettify');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const terser = require('gulp-terser');

// html
function buildHtml(isMinify = true) {
    return function () {
        return gulp.src(['src/**/*.ejs', '!src/html/**'], { base: 'src' })
            .pipe(plumber())
            .pipe(ejs({}, {}, {
                context: {
                    get page() {
                        const filePath = this.file?.path || '';
                        return path.basename(filePath, '.ejs');
                    }
                }
            }))
            .pipe(rename({ extname: '.html' }))			// 改檔名
            .pipe(htmlmin({ removeComments: true }))	// 移除註解
            .pipe(isMinify
				// 壓縮版
                ? htmlmin({
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                })
				// 不壓縮
                : prettify({
                    indent_size: 4,
                    wrap_attributes: 'auto',
                    unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
                })
            )
            .pipe(gulp.dest('dist'));
    };
}

// 壓縮版
gulp.task('html:min', buildHtml(true));
// 不壓縮
gulp.task('html:dev', buildHtml(false));

// Sass 編譯
gulp.task('sass', function () {
    return gulp.src('src/sass/**/*.sass')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

// 壓縮 JS
gulp.task('js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(terser()) // 壓縮 JS
        .pipe(rename({ suffix: '.min' })) // 加上 .min
        .pipe(gulp.dest('dist/js'));
});

// 複製任務共通邏輯
function copyTask(src, dest) {
    return function () {
        return gulp.src(src)
            .pipe(plumber())
            .pipe(gulp.dest(dest));
    };
}

// 複製 ico
// gulp.task('favicon', function () {
//     return gulp.src('src/**/*.ico')
//         .pipe(gulp.dest('dist'));
// });
// gulp.task('favicon', copyTask('src/flyHigh.ico', 'dist'));

// 複製 img
gulp.task('images', copyTask('src/img/**/*', 'dist/img'));

// 複製 library
gulp.task('library', copyTask('src/library/**/*', 'dist/library'));

// 監看
gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.sass', gulp.series('sass'));
    gulp.watch('src/**/*.ejs', gulp.series('html:dev'));
    gulp.watch('src/img/**/*', gulp.series('images'));
    gulp.watch('src/js/**/*', gulp.series('js'));
    gulp.watch('src/library/**/*', gulp.series('library'));
});

// default
gulp.task('default', gulp.series('html:dev', 'sass', 'js', 'images', 'library', 'watch'));

// build
gulp.task('build', gulp.series('html:min', 'sass', 'js', 'images', 'library'));