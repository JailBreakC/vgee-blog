requirejs.config
    paths:
        "angular": '../build/lib/angular-route-animate.min'
        "jquery": '../build/lib/jquery.min'
        "skel": '../build/lib/skel.min'
    shim: 
        "angular":
            exports: "angular"
        "skel":
            exports: 'skel'

requirejs ['jquery', 'angular', 'skel'], ($, angular, skel) ->
    #skel配置项
    skel.init 
        containers: 1140
        breakpoints:
            medium: 
                media: '(min-width: 769px) and (max-width: 1200px)'
                containers: '90%'
            small:
                media: '(max-width: 768px)'
                containers: '95%'


    angular.element(document).ready ->
        # setTimeout解决在ng定义前就执行bootstrap的问题。
        setTimeout ->
            angular.bootstrap(document, ['myblog'])
            
    app = angular.module 'myblog', [
        "ngRoute"
        "ngAnimate"
    ]
    app.config [
        '$routeProvider', 
        '$locationProvider', 
        ($routeProvider, $locationProvider) -> 
            $routeProvider.when("/",
                templateUrl: '/template/page-main.html'
            ).when("/cv",
                templateUrl: '/template/page-cv.html'
            ).when("/contact",
                templateUrl: '/template/page-msg.html'
            ).when("/project",
                templateUrl: '/template/page-project.html'
            ).otherwise redirectTo: "/"
    ]

    app.directive 'cover', -> 
        restrict: 'EA'
        link: (scope, element, attrs) ->
            cover = ->
                element = $(element);
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

    app.directive 'drag', ->
        restrict: 'EA'
        link: (scope, element, attrs) ->
            element = $(element);
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


    app.controller 'mainCtrl', [
        '$scope', 
        '$http', 
        '$routeParams',
        ($scope,$http,$routeParams) ->
            xxx = 'x'
    ]
