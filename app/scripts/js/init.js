console.log(debug);

if (!debug) {
  requirejs.config({
    baseUrl: 'build/js',
    paths: {
      'angular': '//7mnmwm.com1.z0.glb.clouddn.com/js/build/lib/angular-route-animate.min',
      'jquery': '//7mnmwm.com1.z0.glb.clouddn.com/js/build/lib/jquery.min',
      'bootstrap': '//7mnmwm.com1.z0.glb.clouddn.com/js/build/lib/bootstrap.min',
      'markdown': '//7mnmwm.com1.z0.glb.clouddn.com/js/build/lib/markdown.min',
      'hljs': '//7mnmwm.com1.z0.glb.clouddn.com/js/build/lib/highlight.pack',
      'config': 'config.min',
      'directive': 'directive.min',
      'controller': 'controller.min',
      'factory': 'factory.min',
      'filter': 'filter.min'
    },
    shim: {
      'angular': {
        exports: 'angular'
      },
      'bootstrap': {
        deps: ['jquery'],
        exports: 'bootstrap'
      },
      'markdown': {
        exports: 'markdown'
      }
    }
  });
} else {
  requirejs.config({
    baseUrl: 'app/scripts/js',
    paths: {
      'angular': 'js/build/lib/angular-route-animate.min',
      'jquery': 'js/build/lib/jquery.min',
      'bootstrap': 'js/build/lib/bootstrap.min',
      'markdown': 'js/build/lib/markdown.min',
      'hljs': 'js/build/lib/highlight.pack',
      'config': 'config',
      'directive': 'directive',
      'controller': 'controller',
      'factory': 'factory',
      'filter': 'filter'
    },
    shim: {
      'angular': {
        exports: 'angular'
      },
      'bootstrap': {
        deps: ['jquery'],
        exports: 'bootstrap'
      },
      'markdown': {
        exports: 'markdown'
      }
    }
  });
}

requirejs(['jquery', 'angular', 'bootstrap', 'config', 'directive', 'controller', 'factory', 'filter'], function($, angular) {
  return angular.bootstrap(document, ['myblog']);
});
