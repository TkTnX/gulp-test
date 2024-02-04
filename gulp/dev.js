const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");

const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");

// clean

gulp.task("clean:dev", (done) => {
  if (fs.existsSync("./build/")) {
    return gulp.src("./build/", { read: false }).pipe(clean({ force: false }));
  }
  done();
});

// include files
const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError(),
    title: title,
    message: "Error <%= error.message %>",
    sound: false,
  };
};

gulp.task("html:dev", () => {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./build/", { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify("HTML", { sound: false })))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest("./build/"));
});

// sass

gulp.task("sass:dev", () => {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./build/css"))
    .pipe(plumber(plumberNotify("scss", { sound: false })))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./build/css"));
});

// copy files
gulp.task("img:dev", () => {
  return gulp
    .src("./src/img/**/*")
    .pipe(changed("./build/img/"))
    .pipe(gulp.dest("./build/img/"));
});
gulp.task("fonts:dev", () => {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./build/fonts"))
    .pipe(gulp.dest("./build/fonts/"));
});
gulp.task("files:dev", () => {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./build/files"))
    .pipe(gulp.dest("./build/files/"));
});

gulp.task("js:dev", () => {
  return (
    gulp
      .src("./src/js/*.js")
      .pipe(changed("./build/js"))
      .pipe(plumber(plumberNotify("JS")))
      // .pipe(babel())
      .pipe(webpack(require("./../webpack.config.js")))
      .pipe(gulp.dest("./build/js"))
  );
});

// server

const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task("start:dev", () => {
  return gulp.src("./build/").pipe(server(serverOptions));
});

// watch

gulp.task("watch:dev", () => {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"));
  gulp.watch("./src/**/*.html", gulp.parallel("html:dev"));
  gulp.watch("./src/img/**/*", gulp.parallel("img:dev"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:dev"));
  gulp.watch("./src/files/**/*", gulp.parallel("files:dev"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js:dev"));
});
