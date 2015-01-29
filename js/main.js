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
          } else {
            return element.css('left', 0);
          }
        };
        cover();
        return window.onresize = function() {
          return cover();
        };
      }
    };
  });

  myblogApp.directive('drag', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var moveDrag;
        moveDrag = function() {
          var X, Y, start;
          start = 0;
          X = 0;
          Y = 0;
          return element.mousedown(function(event) {
            console.log(X);
            start = 1;
            X = event.clientX;
            Y = event.clientY;
            $('body').mousemove(function(eve) {
              var theX;
              console.log('start2' + start);
              if (start) {
                theX = eve.clientX - X;
                X = eve.clientX;
                element.parent().css('left', '+=' + theX + 'px');
                $('.bk-left').css('width', '+=' + theX + 'px');
                return $('.bk-right').css('left', '+=' + theX + 'px');
              }
            });
            return $('body').mouseup(function() {
              if (start === 1) {
                start = 0;
                $('body').unbind('mousemove');
                return $('body').unbind('mouseup');
              }
            });
          });
        };
        return moveDrag();
      }
    };
  });

  postCtrlf = function($scope, $http, $routeParams) {};

  postCtrl = ['$scope', '$http', '$routeParams', postCtrlf];

  indexCtrlf = function($scope, $http, $routeParams) {};

  indexCtrl = ['$scope', '$http', '$routeParams', indexCtrlf];

  myblogApp.controller('postCtrl', postCtrl);

  myblogApp.controller('indexCtrl', indexCtrl);

}).call(this);
