// gulpfile.js
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const cssnano = require('cssnano');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const ejs = require('gulp-ejs');
const htmlmin = require('gulp-htmlmin');
const prettify = require('gulp-prettify');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer').default;
const terser = require('gulp-terser');
const sizeOf = require('image-size').default;
const timestamp = Date.now();
const gzip = require('gulp-gzip');
const brotli = require('gulp-brotli');

// 啟用 brotli 壓縮字型
// gulp.task('compress-brotli-fonts', () => {
//   return gulp.src(['dist/**/*.{woff2}'])
//     .pipe(brotli.compress({
//       extension: 'br',
//       quality: 11
//     }))
//     .pipe(gulp.dest('dist'));
// });

// 啟用 brotli 壓縮
gulp.task('compress-brotli', () => {
return gulp.src(['dist/**/*.{html,css,js}'])
	.pipe(brotli.compress({
		extension: 'br',
		quality: 11
	}))
	.pipe(gulp.dest('dist'));
});

// 啟用 gzip 壓縮
gulp.task('compress-gzip', function () {
return gulp.src(['dist/**/*.html', 'dist/**/*.css', 'dist/**/*.js'])
	.pipe(gzip())
	.pipe(gulp.dest('dist'));
});

// 編譯 EJS，插入圖片尺寸、版本號、壓縮 HTML
function buildHtml(isMinify = true, basePath = '/dist/') {
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
			.pipe(replace('{{basePath}}', basePath))
			.pipe(rename({ extname: '.html' }))

			// 為圖片添加寬高屬性並加入 lazy loading
			.pipe(replace(/<img[^>]+src=["']([^"']+)\.(jpg|jpeg|png|gif|svg|webp)["'][^>]*>/g, (match, imageUrl, ext) => {
				try {
					const cleanImageUrl = imageUrl.replace(/^\/?(dist\/)?img\//, '');
					const imgPath = path.join(__dirname, 'src', 'img', `${cleanImageUrl}.${ext}`);
					console.log(`正在處理圖片: ${imgPath}`);
					if (!fs.existsSync(imgPath)) {
						console.error(`圖片不存在: ${imgPath}`);
						return match;
					}
					const dimensions = sizeOf(fs.readFileSync(imgPath));
					// 為圖片添加寬高屬性並加入 lazy loading
					return match.replace('<img', `<img width="${dimensions.width}" height="${dimensions.height}" loading="lazy"`);
				} catch (err) {
					console.error(`圖片處理錯誤: ${imageUrl}`, err);
					return match;
				}
			}))

			// 加上 CSS/JS/圖片版本號
			.pipe(replace(/(href|src)=["']([^"']+\.(css|js|png|jpg|jpeg|gif|svg|webp))["']/g, (match, attr, url) => {
				if (url.startsWith('http')) return match;
				return `${attr}="${url}?v=${timestamp}"`;
			}))

			// 壓縮 html
			.pipe(htmlmin({ removeComments: true }))
			.pipe(isMinify
				? htmlmin({ collapseWhitespace: true, removeAttributeQuotes: true })
				: prettify({
					indent_size: 4,
					wrap_attributes: 'auto',
					unformatted: ['code', 'pre', 'em', 'strong', 'span', 'i', 'b', 'br']
				})
			)
			.pipe(gulp.dest('dist'));
	};
}

// 不壓縮 Live Server
gulp.task('html:dist', buildHtml(false, '/dist/'));
// 壓縮版 GitHub Pages
gulp.task('html:flyHigh', buildHtml(true, '/flyHigh/'));
// 壓縮版 localhost Netlify vercel 
gulp.task('html:gzip', buildHtml(true, '/'));

// Sass 編譯壓縮
// cleanCSS 不支援新的語法，改用 postcss + cssnano
gulp.task('sass', () => {
return gulp.src('src/sass/**/*.sass')
	.pipe(plumber())
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer())
	.pipe(postcss([
		cssnano({
			preset: ['default', {
			discardComments: { removeAll: true },
			}]
		})
	]))
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('dist/css'));
});

// JS 壓縮
// gulp.task('js', () => {
// 	return gulp.src('src/js/**/*.js')
// 		.pipe(plumber())
// 		.pipe(terser())
// 		.pipe(rename({ suffix: '.min' }))
// 		.pipe(gulp.dest('dist/js'));
// });
// 0708 test
gulp.task('js', () => {
	return gulp.src('src/js/**/*.js', { base: 'src/js' })
		.pipe(plumber())
		.pipe(terser({ module: true }))
		// .pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/js'));
});

// 複製 library
gulp.task('library', () => {
	return gulp.src('src/library/**/*', { encoding: false })
		.pipe(plumber())
		.pipe(gulp.dest('dist/library'));
});

// 複製任務共通邏輯
// function copyTask(src, dest) {
//     return () => gulp.src(src).pipe(plumber()).pipe(gulp.dest(dest));
// }
// gulp.task('library', copyTask('src/library/**/*', 'dist/library'));

// 複製 ico
gulp.task('favicon', () => {
	return gulp.src('src/**/*.ico', { encoding: false })
		.pipe(gulp.dest('dist'));
});

// 複製 img
gulp.task('images', () => {
	return gulp.src([
		'src/img/**/*.jpg',
		'src/img/**/*.jpeg',
		'src/img/**/*.png',
		'src/img/**/*.gif',
		'src/img/**/*.svg',
		'src/img/**/*.webp'
	], { encoding: false })
		.pipe(gulp.dest('dist/img'));
});

// 開發監看
gulp.task('watch', () => {
	gulp.watch('src/sass/**/*.sass', gulp.series('sass'));
	// gulp.watch('src/**/*.ejs', gulp.series('html:dist'));
	gulp.watch('src/**/*.ejs', gulp.series('html:gzip'));
	gulp.watch('src/js/**/*.js', gulp.series('js'));
	gulp.watch('src/library/**/*', gulp.series('library'));
});

// 本地開發 dist 不壓縮
gulp.task('build-dev', gulp.series('sass', 'html:dist', 'js', 'images', 'favicon', 'library', 'watch'));

// 本地開發 localhost 模擬 brotli 壓縮
gulp.task('build-dev-br', gulp.series('sass', 'html:gzip', 'js', 'images', 'favicon', 'library', 'compress-brotli', 'watch'));

// 部屬 Netlify Vercel 
gulp.task('build-prod-br', gulp.series('sass', 'html:gzip', 'js', 'images', 'favicon', 'library'));

// 預設任務
gulp.task('default', gulp.series('build-dev'));