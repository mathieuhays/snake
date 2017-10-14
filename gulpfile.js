/**
 *	Gulp Config
 */

// Packages
const PATH = require("path");
const GULP = require("gulp");
const WATCH = require("gulp-watch");
const SOURCEMAPS = require("gulp-sourcemaps");
const SASS = require("gulp-sass");
const POSTCSS = require("gulp-postcss");
const AUTOPREFIXER = require("autoprefixer");
const RENAME = require("gulp-rename");
const GUTIL = require("gulp-util");
const WEBPACK = require("webpack-stream");
const UGLIFY = require("gulp-uglify");


// Paths
const SRC = PATH.join(__dirname, "src");
const DIST = PATH.join(__dirname, "dist");

// css
const CSS_SRC = PATH.join(SRC, "scss");
const CSS_DIST = PATH.join(DIST, "css");

// js
const JS_SRC = PATH.join(SRC, "js");
const JS_DIST = PATH.join(DIST, "js");


// Patterns
const JS_ENTRY = PATH.join(JS_SRC, "app.js");
const JS_FILES = PATH.join(JS_SRC, "**", "*.js");

const SCSS_WATCH_ENTRY = [ PATH.join(CSS_SRC, "**", "*.scss") ];
const SCSS_BUILD_ENTRY = [ PATH.join(CSS_SRC, "**", "*.scss"), "!" + PATH.join(CSS_SRC, "**", "_*.scss") ];


/**
 *	Tasks
 */

GULP.task("js:build:development", () => {
  /**
   * require webpack below fixes the issue where gulp-webpack
   * uses webpack v1 and we want to use webpack v2.
   */
  const config = Object.assign({}, require("./webpack.config.js"));
  config.output.filename = "bundle.js";

  return GULP.src(JS_ENTRY)
    .pipe(WEBPACK(config, require("webpack")))
    .pipe(GULP.dest(JS_DIST));
});

GULP.task("js:watch", [ "js:build:development" ], () => {
  WATCH([ JS_FILES ], () => {
    GULP.start("js:build:development");
  });
});

GULP.task("js:build:production", () => {
  /**
   * require webpack below fixes the issue where gulp-webpack uses webpack v1 and we want to use webpack v2.
   */
  const _webpack = require("webpack");

  let config = Object.assign({}, require("./webpack.config.js"), {
    plugins: [
      new _webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true
        },
        output: {
          comments: false
        }
      })
    ]
  });

  config.output.filename = "bundle.min.js";

  return GULP.src(JS_ENTRY)
    .pipe(WEBPACK(config, _webpack))
    .pipe(GULP.dest(JS_DIST));
});


// Parse SASS
GULP.task("scss:build:development", () => {
  return GULP.src(SCSS_BUILD_ENTRY)
    .pipe(SOURCEMAPS.init())
    .pipe(SASS().on("error", GUTIL.log))
    .pipe(POSTCSS([ AUTOPREFIXER({ browsers: [ "> 5%", "IE 9" ] }) ]))
    .pipe(SOURCEMAPS.write())
    .pipe(GULP.dest(CSS_DIST));
});


// Watch SASS changes
GULP.task("scss:watch", [ "scss:build:development" ], () => {
  WATCH(SCSS_WATCH_ENTRY, () => {
    GULP.start("scss:build:development");
  });
});


// Minify SASS/CSS
GULP.task("scss:build:production", () => {
  return GULP.src(SCSS_BUILD_ENTRY)
    .pipe(SASS({ outputStyle: "compressed" }).on("error", GUTIL.log))
    .pipe(POSTCSS([ AUTOPREFIXER({ browsers: [ "> 5%", "IE 9" ] }) ]))
    .pipe(RENAME({ suffix: ".min" }))
    .pipe(GULP.dest(CSS_DIST));
});


GULP.task("js:build:bootstraper", () => {
  return GULP.src(PATH.join(JS_SRC, "bootstraper.js"))
    .pipe(UGLIFY())
    .pipe(RENAME({ suffix: ".min" }))
    .pipe(GULP.dest(JS_DIST));
});


/**
 *	Task Aliases
 */
GULP.task("default", () => {
  GULP.start("scss:watch");
  GULP.start("js:watch");
});

GULP.task("build", [ "scss:build:production", "js:build:production", "js:build:bootstraper" ]);
