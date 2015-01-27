(function() {
  var indexCtrl, indexCtrlf, postCtrl, postCtrlf;

  window.myblogApp = angular.module('myblog', ["ngRoute", "ngAnimate"]);

  myblogApp.config(function($routeProvider, $locationProvider) {
    var list;
    list = "<div class=\"main-bar\">" + "<div apr-animate ng-repeat=\"post in blogList | blogListType : type\" class=\"md\">" + "<div class=\"date\">" + "<p class=\"month\">{{post.date.month}}月</p>" + "<p class=\"day\">{{post.date.day}}</p>" + "</div>" + "<div class=\"md-context\">" + "<h1>{{post.title}}</h1>" + "<div class=\"shot-text\">" + "<p>{{post.disc}}</p>" + "</div>" + "</div>" + "<div class=\"md-foot\">" + "<a ng-click=\"scroll2Top()\" ng-href=\"#/post/{{post.url}}\"><button class=\"pull-right btn btn-danger\">阅读全文</button></a>" + "</div>" + "</div>" + "</div>";
    return $routeProvider.when("/", {
      template: list
    }).when("/type/:type", {
      template: list
    }).when("/post/:name", {
      templateUrl: "partials/page.html"
    }).otherwise({
      redirectTo: "/"
    });
  });

  myblogApp.directive('cover', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var cover;
        cover = function() {
          var eh, ew, wh, ww;
          ew = element.width();
          ww = $(window).width();
          eh = element.height();
          wh = $(window).height();
          element.css('min-width', wh * ew / eh + 'px');
          if (wh === eh) {
            return element.css('left', '-' + (ew - ww) / 2 + 'px');
          }
        };
        cover();
        return window.onresize = function() {
          return cover();
        };
      }
    };
  });

  postCtrlf = function($scope, $http, $routeParams) {};

  postCtrl = ['$scope', '$http', '$routeParams', postCtrlf];

  indexCtrlf = function($scope, $http, $routeParams) {
    return alert('xxx');
  };

  indexCtrl = ['$scope', '$http', '$routeParams', indexCtrlf];

  myblogApp.controller('postCtrl', postCtrl);

  myblogApp.controller('indexCtrl', indexCtrl);

}).call(this);
