requirejs.config
    paths:
        "angular": '../build/lib/angular-route-animate.min'
    shim: 
        "angular":
            exports: "angular"

requirejs ['angular'], (angular) ->
        app = angular.module 'myblog', [
            "ngRoute"
            "ngAnimate"
        ]

        app.config [
            '$routeProvider', 
            '$locationProvider', 
            ($routeProvider, $locationProvider) -> 
                $routeProvider.when("/",
                    templateUrl: '../../template/page-main.html'
                ).when("/cv",
                    templateUrl: '../../template/page-cv.html'
                ).when("/contact",
                    templateUrl: '../../template/page-msg.html'
                ).when("/project",
                    templateUrl: '../../template/page-project.html'
                ).otherwise redirectTo: "/"
        ]

        app.directive 'cover', -> 
            restrict: 'EA'
            link: (scope, element, attrs) ->
         
        app.controller 'mainCtrl', [
            '$scope', 
            '$http', 
            '$routeParams',
            ($scope,$http,$routeParams) ->
                xxx = 'x'
        ]