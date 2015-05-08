/**
 * Created by JailBreak on 2015/1/24.
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: function() {
                var pkg = grunt.file.readJSON('package.json');
                pkg.author = 'JailBreak';
                //console.log(pkg);
                return pkg;
        }(),
        uglify: {
            options: {
                report: "min",
                banner: '/*! <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: [
                    {src: 'js/main.js', dest: 'js/main.min.js'}
                ]
            },
            concat: {
                files:  [
                    {'js/build/lib/lib.min.js': [
                        'js/lib/jquery.min.js',
                        'js/lib/underscore.js',
                        'js/lib/underscore.string.min.js',
                    ]},
                    {'js/build/lib/angular-route-animate.min.js': [
                        'js/lib/angular.js',
                        'js/lib/angular-route.js',
                        'js/lib/angular-animate.min.js'
                    ]}
                ]
            }
        },
        watch: {
            client: {
                files: ['*.html', 'style/main.css'],
                options: {
                    livereload: true
                }
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify:build']);
    grunt.registerTask('lib', ['uglify:build', 'uglify:concat']);
    grunt.registerTask('live', ['watch']);
};