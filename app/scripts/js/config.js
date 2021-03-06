define(['jquery', 'angular'], function($, angular) {
  var app;
  app = angular.module('myblog', ['ui.router', 'ngAnimate']);
  return app.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $stateProvider.state('index', {
        url: '',
        templateUrl: '/template/page-main.html'
      }).state('main', {
        url: '/',
        templateUrl: '/template/page-main.html'
      }).state('cv', {
        url: '/cv',
        templateUrl: '/template/page-cv.html'
      }).state('contact', {
        url: '/contact',
        templateUrl: '/template/page-msg.html'
      }).state('project', {
        url: '/projects',
        templateUrl: '/template/page-project.html'
      }).state('blog', {
        url: '/blog',
        templateUrl: '/template/page-blog.html',
        controller: 'blog'
      }).state('blog.list', {
        url: '/:type',
        templateUrl: '/template/page-blog-list.html',
        controller: 'bloglist'
      }).state('blog.detail', {
        url: '/post/:article',
        templateUrl: '/template/page-blog-detail.html',
        controller: 'blogdetail'
      }).state('developing', {
        url: '/developing',
        templateUrl: '/template/page-developing.html'
      });
      if (debug) {
        return $urlRouterProvider.otherwise('/');
      } else {
        return $urlRouterProvider.otherwise('/developing');
      }
    }
  ]);
});
