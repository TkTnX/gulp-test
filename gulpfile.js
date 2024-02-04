const gulp = require("gulp");

// tasks
require("./gulp/dev");
require("./gulp/docs");

// default

gulp.task(
  "default",
  gulp.series(
    "clean:dev",
    gulp.parallel(
      "html:dev",
      "sass:dev",
      "img:dev",
      "fonts:dev",
      "files:dev",
      "js:dev"
    ),
    gulp.parallel("start:dev", "watch:dev")
  )
);

gulp.task(
  "docs",
  gulp.series(
    "clean:docs",
    gulp.parallel(
      "html:docs",
      "sass:docs",
      "img:docs",
      "fonts:docs",
      "files:docs",
      "js:docs"
    ),
    gulp.parallel("start:docs")
  )
);
