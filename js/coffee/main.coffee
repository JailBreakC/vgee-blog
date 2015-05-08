requirejs.config
    baseUrl: '',
    paths:
        angular: 'lib/angular.js'

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
                        template: list
                ).when("/type/:type",
                    template: list
                ).when("/post/:name",
                    templateUrl: "partials/page.html"
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