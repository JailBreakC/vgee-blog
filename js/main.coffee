window.myblogApp = angular.module('myblog',[
    "ngRoute"
    "ngAnimate"
])

myblogApp.config ($routeProvider, $locationProvider) ->
    list = "<div class=\"main-bar\">" + "<div apr-animate ng-repeat=\"post in blogList | blogListType : type\" class=\"md\">" + "<div class=\"date\">" + "<p class=\"month\">{{post.date.month}}月</p>" + "<p class=\"day\">{{post.date.day}}</p>" + "</div>" + "<div class=\"md-context\">" + "<h1>{{post.title}}</h1>" + "<div class=\"shot-text\">" + "<p>{{post.disc}}</p>" + "</div>" + "</div>" + "<div class=\"md-foot\">" + "<a ng-click=\"scroll2Top()\" ng-href=\"#/post/{{post.url}}\"><button class=\"pull-right btn btn-danger\">阅读全文</button></a>" + "</div>" + "</div>" + "</div>"
    $routeProvider.when("/",
        template: list
    ).when("/type/:type",
        template: list
    ).when("/post/:name",
        templateUrl: "partials/page.html"
    ).otherwise redirectTo: "/"

myblogApp.directive 'cover', ->
    restrict: 'EA'
    link: (scope, element, attrs) ->
        cover = ->
            ew = element.width()
            ww = $(window).width()
            eh = element.height()
            wh = $(window).height()
            #按需放大
            element.css('min-width', wh*ew/eh + 'px');
            #居中
            if(wh == eh)
                element.css('left', '-' + (ew-ww)/2 + 'px')
        cover()
        window.onresize = ->
            cover()

postCtrlf = ($scope,$http,$routeParams) ->



postCtrl = ['$scope','$http','$routeParams', postCtrlf]


indexCtrlf = ($scope,$http,$routeParams) ->
    alert 'xxx'


indexCtrl = ['$scope','$http','$routeParams', indexCtrlf]

myblogApp.controller 'postCtrl',postCtrl
myblogApp.controller 'indexCtrl',indexCtrl
