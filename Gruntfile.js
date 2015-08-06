/**
 * Created by JailBreak on 2015/1/24.
 */
module.exports = function(grunt) {

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-concat');
    // Project configuration.
    grunt.initConfig({
        pkg: function() {
                var pkg = grunt.file.readJSON('package.json');
                pkg.author = 'JailBreak';
                return pkg;
        }(),
        uglify: {
            options: {
                report: "min",
                banner: '/*! <%= pkg.author %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                expand: true,
                cwd: 'app/scripts/js',
                src: '*.js',
                dest: 'build/js',
                ext: '.min.js'
            }
            ,
            concat: {
                files:  [
                    {'app/scripts/js/lib/angular-route-animate.js': [
                        'app/scripts/js/lib/angular.js',
                        'app/scripts/js/lib/angular-ui-router.js',
                        'app/scripts/js/lib/angular-animate.js'
                        ]
                    }
                ]
            }
        },
        concat: {
            dist: {
                  src: ['app/scripts/js/lib/angular.js',
                        'app/scripts/js/lib/angular-ui-router.js',
                        'app/scripts/js/lib/angular-animate.js'],
                  dest: 'app/scripts/js/lib/angular-route-animate.js',
            },
        },
        watch: {
            less: {
                options: {
                    livereload: true,
                    spawn: false
                },
                files: ['**/*.html', 'app/assets/less/*.less'],
                tasks: ['less:development']
            },
            coffee: {
                options: {
                    livereload: false,
                    spawn: false
                },
                files: ['app/scripts/coffee/*.coffee'],
                tasks: ['coffee:dev']
            }
        },
        less: {
            development: {
                expand: true,
                options: {
                    plugins: [
                        new (require('less-plugin-autoprefix'))()/*,
                        new (require('less-plugin-clean-css'))()*/
                    ]
                },
                cwd: 'app/assets/less/',
                src: '*.less',
                dest: 'app/assets/css/',
                ext: '.css'
            },
            production: {
                expand: true,
                options: {
                    plugins: [
                        new (require('less-plugin-autoprefix'))(),
                        new (require('less-plugin-clean-css'))()
                    ]/*,
                    modifyVars: {
                        imgPath: '"http://mycdn.com/path/to/images"',
                        bgColor: 'red'
                    }*/
                },
                cwd: 'app/assets/less/',
                src: '*.less',
                dest: 'build/css/',
                ext: '.min.css'
            }
        },
        coffee: {
            dev: {
                expand: true,
                options: {
                    sourceMap: false,
                    bare: true
                },
                cwd: 'app/scripts/coffee/',
                src: '*.coffee',
                dest: 'app/scripts/js',
                ext: '.js'
            }
        }
    });


    // 默认被执行的任务列表。
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['less:production', 'coffee:dev', 'uglify:build']);
    grunt.registerTask('live', ['watch']);
    grunt.registerTask('cat', ['concat']);
};























