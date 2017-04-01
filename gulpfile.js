/*global require*/
"use strict";

var gulp = require('gulp'),
	path = require('path'),
	pug = require('gulp-pug'),
	prefix = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync');

/*
* Change directories here
*/
var settings = {
	publicDir: '_site',
	sassDir: 'assets/css',
	cssDir: '_site/assets/css'
};

/**
 * Compile .pug files
 */
gulp.task('pug', function () {
	return gulp.src('*.pug')
		.pipe(pug())
		.pipe(gulp.dest(settings.publicDir));
});

/**
 * Recompile .pug files and live reload the browser
 */
gulp.task('pug-rebuild', ['pug'], function () {
	browserSync.reload();
});

/**
 * Wait for pug and sass tasks, then launch the browser-sync Server
 */
gulp.task('browser-sync', ['sass', 'pug'], function () {
	browserSync({
		server: {
			baseDir: settings.publicDir
		},
		notify: false
	});
});

/**
 * Compile .sass files into public css directory With autoprefixer no
 * need for vendor prefixes then live reload the browser.
 */
gulp.task('sass', function () {
	return gulp.src(settings.sassDir + '/**/*.sass')
		.pipe(sass({
			includePaths: [settings.sassDir],
			outputStyle: 'compressed'
		}))
		.on('error', sass.logError)
		.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(gulp.dest(settings.cssDir))
		.pipe(browserSync.reload({stream: true}));
});

/**
 * Watch sass files for changes & recompile
 * Watch .pug files run pug-rebuild then reload BrowserSync
 */
gulp.task('watch', function () {
	gulp.watch(settings.sassDir + '/**', ['sass']);
	gulp.watch(['*.pug', '**/*.pug'], ['pug-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['browser-sync', 'watch']);
