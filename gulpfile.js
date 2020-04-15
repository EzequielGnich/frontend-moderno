"use strict";

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  clean = require("gulp-clean"),
  include = require("gulp-file-include"),
  autoprefixer = require("gulp-autoprefixer"),
  uncss = require("gulp-uncss"),
  imagemin = require("gulp-imagemin"),
  cssnano = require("gulp-cssnano"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat");

sass.compiler = require("node-sass");

gulp.task("clean", () => {
  return gulp.src("./dist").pipe(clean());
});

gulp.task("copy", () => {
  return gulp
    .src(["./src/components/**/*"], {
      base: "src",
    })
    .pipe(gulp.dest("dist"));
});

gulp.task("sass", function () {
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest("./dist/css/"));
});

gulp.task("buildJS", () => {
  return gulp
    .src("./src/javascript/**/*")
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/javascript"));
});

gulp.task("html", function () {
  return gulp
    .src(["./src/**/*.html", "!src/inc/**/*"])
    .pipe(include())
    .pipe(gulp.dest("./dist/"));
});

gulp.task(
  "uncss",
  gulp.series("html", () => {
    return gulp
      .src("./dist/components/**/*.css")
      .pipe(
        uncss({
          html: ["./dist/*.html"],
        })
      )
      .pipe(gulp.dest("./dist/components/"));
  })
);

gulp.task("imagemin", () => {
  return gulp
    .src("./src/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/img"));
});

gulp.task(
  "server",
  gulp.series(["clean", "uncss", "imagemin", "sass", "copy", "buildJS"], () => {
    browserSync.init({
      server: {
        baseDir: "./dist",
      },
    });

    gulp.watch("./dist/**/*").on("change", browserSync.reload);

    gulp.watch("./src/sass/**/*.scss", gulp.parallel(["sass"]));
    gulp.watch("./src/**/*.html", gulp.parallel(["html"]));
    gulp.watch("./src/javascript/**/*", gulp.parallel(["buildJS"]));
  })
);
