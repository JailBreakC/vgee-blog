/**
 * Created by JailBreak on 2015/1/24.
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: function() {
                var pkg = grunt.file.readJSON('package.json');
                //console.log(pkg);
                return pkg;
            }(),
        uglify: {
            options: {
                report: "min",
                banner: '/*! <%= pkg.customJS %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: [
                    {src: 'js/controller.js', dest: 'js/controller.min.js'},
                    {src: 'js/main.js', dest: 'js/main.min.js'}
                ]
            },
            concat: {
                files: {'js/lib/lib.min.js': [
                                            'js/lib/jquery.min.js',
                                            'js/lib/angular.min.js',
                                            'js/lib/underscore.js',
                                            'js/lib/underscore.string.min.js',
                                            'js/lib/jquery.stellar.min.js',
                                            'js/lib/angular-route.js',
                                            'js/lib/angular-animate.min.js',
                                            'js/lib/marked.js',
                                            'js/lib/highlight.pack.js'
                                        ]}
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
    grunt.registerTask('lib', ['uglify:concat']);
    grunt.registerTask('live', ['watch']);
    grunt.registerTask('build', 'require demo', function () {
        //任务列表
        var tasks = ['requirejs'];
        //源码文件
        var srcDir = 'src';
        //目标文件
        var destDir = 'dest';
        //设置参数
        grunt.config.set('config', {
            srcDir: srcDir,
            destDir: destDir
        });
        //设置requireJs的信息
        var taskCfg = grunt.file.readJSON('gruntCfg.json');
        var options = taskCfg.requirejs.main.options,
            platformCfg = options.web,
            includes = platformCfg.include,
            paths = options.paths;
        var pos = -1;
        var requireTask = taskCfg.requirejs;
        options.path = paths;
        options.out = platformCfg.out;
        options.include = includes;
        //运行任务
        grunt.task.run(tasks);
        grunt.config.set("requirejs", requireTask);
    });
};