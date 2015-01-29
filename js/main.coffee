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
            else
                element.css('left', 0)

        cover()
        window.onresize = ->
            cover()

myblogApp.directive 'drag', ->
    restrict: 'EA'
    link: (scope, element, attrs) ->
        moveDrag = ->
            start = 0
            X = 0
            Y = 0
            element.mousedown (event) ->
                console.log X
                start = 1
                #console.log 'start1'+start
                X = event.clientX
                Y = event.clientY
                $('body').mousemove (eve) ->
                    console.log 'start2'+start
                    if start
                        theX = eve.clientX - X
                        X = eve.clientX
                        #console.log 'x'+X+'cx'+eve.clientX+'thx'+theX
                        element.parent().css('left', '+=' + theX + 'px')
                        $('.bk-left').css('width', '+=' + theX + 'px')
                        $('.bk-right').css('left', '+=' + theX + 'px')
                $('body').mouseup () ->
                    #console.log 'up'
                    if start == 1
                        start = 0;
                        $('body').unbind 'mousemove'
                        $('body').unbind 'mouseup'
        moveDrag()


postCtrlf = ($scope,$http,$routeParams) ->



postCtrl = ['$scope','$http','$routeParams', postCtrlf]


indexCtrlf = ($scope,$http,$routeParams) ->


indexCtrl = ['$scope','$http','$routeParams', indexCtrlf]

myblogApp.controller 'postCtrl',postCtrl
myblogApp.controller 'indexCtrl',indexCtrl
