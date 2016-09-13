var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var fs = require('fs');

var getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

//lint
gulp.task('lint', function() {
  return gulp.src('emergency-alerts.js')
  		.pipe(jshint())
  		.pipe(jshint.reporter('default'));
});

//Minify / Uglify
gulp.task('minify', function() {
	return gulp.src('emergency-alerts.js')
		.pipe(concat('emergency-alerts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./'));
});

gulp.task('default', ['lint', 'minify']);