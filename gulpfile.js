"use strict";

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  clean = require("gulp-clean"),
  include = require("gulp-file-include");

sass.compiler = require("node-sass");

gulp.task("clean", function () {
  return gulp.src("./dist").pipe(clean());
});

gulp.task(
  "copy",
  gulp.series("clean", () => {
    gulp
      .src(
        [
          "./src/components/**/*",
          "./src/javascript/**/*",
          "./src/css/**/*",
          "./src/img/**/*",
        ],
        {
          base: "src",
        }
      )
      .pipe(gulp.dest("dist"));
  })
);

gulp.task("sass", function () {
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dist/css/"));
});

gulp.task("html", function () {
  return gulp.src("./src/**/*.html").pipe(include()).pipe(gulp.dest("./dist/"));
});

gulp.task(
  "server",
  gulp.series("html", () => {
    browserSync.init({
      server: {
        baseDir: "./dist",
      },
    });

    gulp.watch("./dist/**/*").on("change", browserSync.reload);

    gulp.watch("./src/sass/**/*.scss", gulp.parallel(["sass"]));
    gulp.watch("./src/**/*.html", gulp.parallel(["html"]));
  })
);
