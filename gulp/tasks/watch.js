
var gulp = require('gulp');

gulp.task('watch',
	[
		'frontend'
	,	'watch-javascript'
	,	'watch-less'
	,	'watch-sass'
	,	'watch-languages'
	,	'watch-fonts'
	,	'watch-images'
	,	'watch-hosting-root-files'
]);
