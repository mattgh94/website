// init modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// ts modules
const ts = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');

// use dart-sass for @use
// sass.compiler = require('dart-sass');



// Sass Task
function scssTask() {
	return src('app/scss/style.scss', { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(dest('dist', { sourcemaps: '.' }));
}

// js compile
function jsTask() {
    return src('app/js/script.js', { sourcemaps: true })
        .pipe(babel({ presets: ['@babel/preset-env']}))
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }));
}

// ts compile
function tsTask() {
    return src('app/ts/*.ts')
    .pipe(sourcemaps.init())
    .pipe(ts({
        noImplicitAny: true,
        outFile: 'tsoutput.js'
    }))
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../ts' }))
    .pipe(dest('dist'));
};

// browserSync
function browserSyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.',
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}
function browserSyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch Task
function watchTask() {
    watch('*.html', browserSyncReload);
    watch(['app/scss/**/*.scss', 'app/**/*.js', 'app/**/*.ts'],
    series(scssTask, jsTask, tsTask, browserSyncReload)
    );
}

// Default gulp taks
exports.default = series(scssTask, jsTask, tsTask, browserSyncServe, watchTask);