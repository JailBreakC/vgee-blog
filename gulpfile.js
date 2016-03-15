var gulp  = require('gulp'),         //基础库
  minifycss = require('gulp-minify-css'),  //css压缩
  less = require('gulp-less'),        //less编译
  jshint = require('gulp-jshint'),      //js检查
  uglify = require('gulp-uglify'),     //js压缩
  rename = require('gulp-rename'),      //重命名
  concat = require('gulp-concat'),     //合并文件
  clean = require('gulp-clean'),       //清空文件夹
  connect = require('gulp-connect'),     //webserver
  port = 8080;

gulp.task('webserver', function() {
  connect.server({
    port: port,
    livereload: true
  });
});
// HTML处理
var htmlSrc = './msg/app/templet/**/*.html',
    htmlDst = './msg/build/templet/';

var cssSrc = './msg/app/**/*.less',
    cssDst = './msg/app/css/',
    cssMinDst = './msg/build/css/';

var jsSrc = './msg/app/js/**/*.js',
    jsDst ='./msg/build/js/';

gulp.task('html', function() {

  gulp.src(htmlSrc)
    .pipe(connect.reload())
    .pipe(gulp.dest(htmlDst))
});
// 样式处理
gulp.task('css', function () {

  gulp.src(cssSrc)
    .pipe(less({ style: 'expanded'}))
    .on( 'error', function(e){console.log(e)} )
    .pipe(gulp.dest(cssDst))
    .pipe(gulp.dest(cssMinDst))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(connect.reload())
    .pipe(gulp.dest(cssMinDst));
});

// js处理
gulp.task('js', function () {


  gulp.src(jsSrc)
    //.pipe(concat('main.js'))
    .pipe(gulp.dest(jsDst))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .on( 'error', function(e){console.log(e)} )
    .pipe(connect.reload())
    .pipe(gulp.dest(jsDst));
});

// 清空样式、js
gulp.task('clean', function() {
  gulp.src([cssDst, jsDst], {read: false})
    .pipe(clean());
});

// 重建任务 清空样式、js并重建 
gulp.task('rebuild', ['clean'], function(){
  gulp.start('html','css','js');
});

// 监听任务 运行语句 gulp watch
gulp.task('default',['webserver'], function(){
  // 监听html
  gulp.watch(htmlSrc, function(event){
    gulp.run('html');
  })

  // 监听css
  gulp.watch(cssSrc, function(){
    gulp.run('css');
  });

  // 监听js
  gulp.watch(jsSrc, function(){
    gulp.run('js');
  });
});