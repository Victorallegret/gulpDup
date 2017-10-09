// GULP TEMPLATE - Gulfile.js - Victor Allegret
//
//   - $ gulp
//   - $ gulp build
//   - $ gulp clean
//
// --------------------------------------------------------

////////////////////
// VARIABLES
////////////////////////////////////////////////////////////////////////////////



// REQUIRE
// ---------------------------------------------------------

var gulp    = require('gulp'),
    // require every plugins
    plugins = require('gulp-load-plugins')({
        pattern: '*'
    })



// PATH
// ---------------------------------------------------------

///// PATHS FOR DEV
var slim_dev    = './dev/views/',
    sass_dev    = './dev/assets/stylesheets/',
    coffee_dev  = './dev/assets/javascripts/',
    fonts_dev   = './dev/assets/fonts/',
    img_dev     = './dev/assets/images/',
    dev         = './dev';

///// PATH FOR PROD
var slim_build     = './build/views/',
    sass_build     = './build/assets/stylesheets/',
    coffee_build   = './build/assets/javascripts/',
    fonts_build    = './build/assets/fonts/',
    img_build      = './build/assets/images/',
    build          = './build';





////////////////////
// TASKS
////////////////////////////////////////////////////////////////////////////////



// COMPILE SLIM TO HTML
// ---------------------------------------------------------
gulp.task('slim', function () {
  return gulp.src([slim_dev + '/**/*.slim', '!./dev/views/partials/**/*.slim', '!./dev/views/layout/**/*.slim'])
    // prevent server from crashing
    .pipe(plugins.plumber({ errorHandler: function(err) {
      plugins.notify.onError({
          title: "Gulp error in " + err.plugin
      })(err);
    }}))
    // compile slim to html
    .pipe(plugins.slim({
      pretty: false,
      include: true
    }))
    // run task only for updated files
    .pipe(plugins.newer(build))
    // remove all folder
    .pipe(plugins.rename({dirname: ''}))
    // copy result to build folder
    .pipe(gulp.dest(build))
    // notify when task completed
    .pipe(plugins.notify({message: 'Slim compilation completed !', onLast: true}));
});



// COMPILE SASS TO CSS
// ---------------------------------------------------------
gulp.task('sass', function () {
  return gulp.src([sass_dev + '/**/*.sass', '!./dev/assets/stylesheets/vendors/**/*.{css,scss,sass}'])
    // prevent server from crashing
    .pipe(plugins.plumber({ errorHandler: function(err) {
      plugins.notify.onError({
          title: "Gulp error in " + err.plugin,
      })(err);
    }}))
    // add sass glob import
    .pipe(plugins.sassGlob())
    // compile sass to css
    .pipe(plugins.sass())
    // add auto-prefixes
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    // concat all files
    .pipe(plugins.concat('main.css'))
    // rename to .min
    .pipe(plugins.rename('main.min.css'))
    // copy result to build folder
    .pipe(gulp.dest(sass_build))
    // notify when task completed
    .pipe(plugins.notify({message: 'Sass compilation completed !', onLast: true}));
});



// CONCAT CSS VENDORS
// ---------------------------------------------------------
gulp.task('cssVendors', function () {
  return gulp.src(sass_dev + '/vendors/**/*.{css,scss,sass}')
    // compile sass to css
    .pipe(plugins.sass())
    // concat all files
    .pipe(plugins.concat('vendors.css'))
    // rename to .min
    .pipe(plugins.rename('vendors.min.css'))
    // copy result to build folder
    .pipe(gulp.dest(sass_build))
    // notify when task completed
    .pipe(plugins.notify({message: 'Css vendors compilation completed !', onLast: true}));
});



// COMPILE COFFEE TO JS
// ---------------------------------------------------------
gulp.task('coffee', function() {
  return gulp.src(coffee_dev + '/main.coffee')
    // prevent server from crashing
    .pipe(plugins.plumber({ errorHandler: function(err) {
      plugins.notify.onError({
          title: "Gulp error in " + err.plugin,
      })(err);
    }}))
    // add include for coffee
    .pipe(plugins.include({ extensions: "coffee" }))
    // compile coffee to js
    .pipe(plugins.coffee())
    // concat all files
    .pipe(plugins.concat('main.js'))
    // rename to .min
    .pipe(plugins.rename('main.min.js'))
    // minify js
    .pipe(plugins.uglify())
    // // copy result to build folder
    .pipe(gulp.dest(coffee_build))
    // notify when task completed
    .pipe(plugins.notify({message: 'Coffee compilation completed !', onLast: true}));
});



// COMPILE COFFEE TO JS
// ---------------------------------------------------------
gulp.task('jsVendors', function() {
  return gulp.src(coffee_dev + '/vendors.js')
    // require node packages
    .pipe(plugins.browserify({
      insertGlobals: true
    }))
    // minify js
    .pipe(plugins.uglify())
    // concat all files
    .pipe(plugins.concat('vendors.js'))
    // rename to .min
    .pipe(plugins.rename('vendors.min.js'))
    // // copy result to build folder
    .pipe(gulp.dest(coffee_build))
    // notify when task completed
    .pipe(plugins.notify({message: 'Js vendors compilation completed !', onLast: true}));
});



// FONTS
// ---------------------------------------------------------
gulp.task('fonts', function() {
  return gulp.src(fonts_dev + '/**/*.{eot,svg,ttf,woff,woff2}')
    // remove under-folder
    .pipe(plugins.rename({dirname: ''}))
    // copy result to build folder
    .pipe(gulp.dest(fonts_build))
    .pipe(plugins.notify({message: 'Fonts compilation completed !', onLast: true}));
});



// REMOVE UNUSED CSS
// ---------------------------------------------------------
gulp.task('uncss', function () {
  return gulp.src(sass_build + '/*.min.css')
  // remove unused css
   .pipe(plugins.uncss({
      html: [build + '/**/*.html']
   }))
   // minify css
   .pipe(plugins.minifyCss())
   // copy result to build folder
   .pipe(gulp.dest(sass_build))
   // notify when task completed
   .pipe(plugins.notify({message: 'Css are optimized !', onLast: true}));
});



// MINIFY IMAGES
// ---------------------------------------------------------
gulp.task('img', function () {
  return gulp.src(img_dev + '/**/*.{png,jpg,jpeg,gif,svg,ico}')
    // run task only for updated files
    .pipe(plugins.newer(img_build))
    // minify images
    .pipe(plugins.imagemin())
    // copy result to build folder
    .pipe(gulp.dest(img_build))
    // notify when task completed
    .pipe(plugins.notify({message: 'Image are optimized !', onLast: true}));
});



// RELOAD
// ---------------------------------------------------------

///// RELOAD SLIM
gulp.task('reload-slim', ['slim'], function(){
  plugins.browserSync.reload();
});


///// RELOAD SASS
gulp.task('reload-sass', ['sass'], function(){
  plugins.browserSync.reload();
});


///// RELOAD COFFEE
gulp.task('reload-coffee', ['coffee'], function(){
  plugins.browserSync.reload();
});





////////////////////
// COMMANDS
////////////////////////////////////////////////////////////////////////////////

// TASK CLEAN ($ gulp clean)
// ---------------------------------------------------------
gulp.task('clean', function () {
  return gulp.src(build, {read: false})
    .pipe(plugins.rimraf())
    .pipe(plugins.notify('Prod folder deleted !'));
});



// TASK DEV ($ gulp dev)
// ---------------------------------------------------------
gulp.task('dev', ['slim', 'sass', 'cssVendors', 'coffee', 'jsVendors', 'fonts', 'img']);



// TASK BUILD ($ gulp build)
// ---------------------------------------------------------
gulp.task('build', ['dev'], function(){
  gulp.start(['uncss']);
});



// RUN SERVER ($ gulp)
// ---------------------------------------------------------

///// WATCH
gulp.task('watch', ['dev'], function () {
  plugins.browserSync.init({
    port: 3000,
    server: {
      baseDir: build,
      index: "index.html"
    },
    online: true,
    scrollProportionally: true,
    notify: false
  })
  gulp.watch(dev + '/**/*.slim', ['reload-slim']);
  gulp.watch(dev + '/**/*.sass', ['reload-sass']);
  gulp.watch(dev + '/**/*.coffee', ['reload-coffee']);
});

////// COMMAND
gulp.task('default', ['clean'], function(){
  gulp.start(['watch']);
});