console.log debug
libs = []
if not debug
    requirejs.config
        baseUrl: 'build/js'
        paths:
            'jquery': '//7mnmwm.com1.z0.glb.clouddn.com/js/build/lib/jquery.min'
            'angular': '//7mnmwm.com1.z0.glb.clouddn.com/js/build/lib/angular-route-animate.min'
            'bootstrap': '//7mnmwm.com1.z0.glb.clouddn.com/js/build/lib/bootstrap.min'
            'markdown': '//7mnmwm.com1.z0.glb.clouddn.com/js/build/lib/markdown.min'
            'hljs': '//7mnmwm.com1.z0.glb.clouddn.com/js/build/lib/highlight.pack'
            'config': 'config.min'
            'directive': 'directive.min'
            'controller': 'controller.min'
            'factory': 'factory.min'
            'filter': 'filter.min'
        shim: 
            'angular':
                exports: 'angular'
            'bootstrap':
                deps: ['jquery'],
                exports: 'bootstrap'
            'markdown':
                exports: 'markdown'
    libs = [
        'jquery'
        'angular'
        'bootstrap'
        'config'
        'directive'
        'controller'
        'factory'
        'filter'
    ]
else
    requirejs.config
        baseUrl: 'app/scripts/js'
        paths:
            'jquery': 'http://cdn.staticfile.org/jquery/1.11.1/jquery'
            'angular': 'lib/angular'
            'ngRoute': 'lib/angular-ui-router'
            'ngAnimate': 'lib/angular-animate'
            'bootstrap': 'http://cdn.staticfile.org/twitter-bootstrap/3.3.1/js/bootstrap'
            'markdown': 'js/build/lib/markdown'
            'hljs': 'js/build/lib/highlight.pack'
            'config': 'config'
            'directive': 'directive'
            'controller': 'controller'
            'factory': 'factory'
            'filter': 'filter'
        shim: 
            'angular':
                deps: ['jquery']
                exports: 'angular'
            'ngRoute':
                deps: ['angular']
                exports: 'ngRoute'
            'ngAnimate':
                deps: ['angular']
                exports: 'ngAnimate'
            'bootstrap':
                deps: ['jquery'],
                exports: 'bootstrap'
            'markdown':
                exports: 'markdown'
    libs = [
        'jquery'
        'angular'
        'ngRoute'
        'ngAnimate'
        'bootstrap'
        'config'
        'directive'
        'controller'
        'factory'
        'filter'
    ]

console.log libs 

requirejs libs, ($, angular) ->
    angular.bootstrap(document, ['myblog'])






