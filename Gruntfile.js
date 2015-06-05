/**
 * Created by JailBreak on 2015/1/24.
 */
module.exports = function(grunt) {

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
                files: [
                    {src: 'js/lib/markdown.js', dest: 'js/build/lib/markdown.min.js'}
                ]
            },
            concat: {
                files:  [
                    {'js/build/lib/angular-route-animate.min.js': [
                        'js/lib/angular.js',
                        'js/lib/angular-ui-router.js',
                        'js/lib/angular-animate.min.js'
                        ]
                    }
                ]
            }
        },
        watch: {
            less: {
                options: {
                    livereload: true,
                    spawn: false
                },
                files: ['**/*.html', 'style/less/*.less'],
                tasks: ['less:development']
            },
            coffee: {
                options: {
                    livereload: false,
                    spawn: false
                },
                files: ['js/coffee/*.coffee'],
                tasks: ['coffee:dev']
            }
        },
        less: {
            development: {
                options: {
                    plugins: [
                        new (require('less-plugin-autoprefix'))()/*,
                        new (require('less-plugin-clean-css'))()*/
                    ]
                },
                files: {
                    "style/build/main.css": "style/less/*.less"
                }
            },
            production: {
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
                files: {
                    "style/build/main.css": "style/less/*.less"
                }
            }
        },
        coffee: {
            dev: {
                options: {
                    sourceMap: false,
                    bare: true
                },
                files: {
                    "js/compile/main.js": "js/coffee/*.coffee"
                }
            }
        }
    });

    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify:build']);
    grunt.registerTask('lib', ['uglify:build', 'uglify:concat']);
    grunt.registerTask('live', ['watch']);
};