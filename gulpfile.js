var 
	gulp			= require('gulp'),
	rename			= require('gulp-rename'),
	bower			= require('gulp-bower'),
	coffee			= require('gulp-coffee'),
	uglify			= require('gulp-uglify'),
	imagemin		= require('gulp-imagemin'),
	sass			= require('gulp-sass'),
	cleanCSS		= require('gulp-clean-css'),
	bless 			= require('gulp-bless'),
	autoprefixer	= require('gulp-autoprefixer'),
	sourcemaps		= require('gulp-sourcemaps'),
	del				= require('del'),

	URI = {
		src_styles:			'src/css/*.css',
		src_scripts:		'src/js/*.js',
		src_images:			'src/images/*',
		dist_styles:		'dist/css/*.css',
		dist_scripts:		'dist/js/*.js',
		dist_images:		'dist/images/*',
		libs:						'libs/'
	};

gulp.task('bower', function () {
	return bower();
});

gulp.task('sass', function () {
	return gulp.src('./components/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./src/css'));
});

gulp.task('watch', function () {
	gulp.watch('./components/**/*.scss', ['sass']);
});

gulp.task('build', ['delete', 'autoprefix', 'adapt', 'clean', 'optimize']);

gulp.task('delete', function () {
  return del([URI.dist_styles, URI.dist_scripts, URI.dist_images]);
});

gulp.task('autoprefix', ['delete'], function () {
  return gulp.src(URI.src_styles)
		.pipe(sourcemaps.init())
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('src/css'));
});

gulp.task('adapt', ['autoprefix'], function () {
  return gulp.src('src/css/screen.css')
		.pipe(bless())
		.pipe(rename({basename: 'ie'}))
		.pipe(gulp.dest('src/css'));
});

gulp.task('clean', ['adapt'], function () {
  return gulp.src(URI.src_styles)
		.pipe(sourcemaps.init())
		.pipe(cleanCSS({
			keepSpecialComments: 1,
			processImportFrom: 'local',
			compatibility: 'ie8',
			debug: true
		}, function(details) {
			console.log(details.name + ': ' + details.stats.originalSize);
			console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('optimize', ['clean'], function () {
	return gulp.src(URI.src_images)
		.pipe(sourcemaps.init())
		.pipe(imagemin())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/images'));
});
