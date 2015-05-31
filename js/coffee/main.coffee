requirejs.config
    paths:
        'angular': '../build/lib/angular-route-animate.min'
        'jquery': '../build/lib/jquery.min'
        'bootstrap': '../build/lib/bootstrap.min'
        #'skel': '../build/lib/skel.min'
    shim: 
        'angular':
            exports: 'angular'
        'bootstrap':
            deps: ['jquery'],
            exports: 'bootstrap'


requirejs ['jquery', 'angular', 'bootstrap'], ($, angular) ->
    ###skel配置项
    skelparam = 
        containers: 1140
        breakpoints:
            medium: 
                media: '(min-width: 769px) and (max-width: 1200px)'
                containers: '90%'
            small:
                media: '(max-width: 768px)'
                containers: '95%'
        
    skel.init skelparam
    ###

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
            ).when("/blog/:type",
                templateUrl: '/template/page-blog.html'
            ).when("/blog",
                templateUrl: '/template/page-blog.html'
            ).otherwise redirectTo: "/"
    ]
    app.factory 'AuthService', [
        '$http',
        ($http) ->
            fn = {};
            return {};
    ]
    filterType = (data,param) ->
        if param then type = param
        if type and data and type isnt 'all'
            output = []
            for i in data
                if i.type is type
                    output.push i
            ##console.log output
            return output
        return data
    app.filter 'blogListType', ->
        blogListType = filterType


    app.directive 'celAnimate', ->
        restrict: 'EA'
        link: (scope,element,attrs)->
            $(window).scroll ->
                height = $(window).height()
                top = $(window).scrollTop()
                pos = element.offset().top
                if pos - top <= height
                    element.addClass('cel-show')

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
    app.directive 'changeFont', ->
        restrict: 'A'
        link: (scope, element, attrs) ->
            fonts = [
                'cursive',
                '-webkit-body',
                '-webkit-pictograph',
                'fantasy',
                'serif'
            ]
            i = 0
            task = {}
            $(element).hover( ->
                that = @
                title = $('.navbar-brand');
                task.now = setInterval $.proxy( ->
                    $(title).css('font-family',fonts[i]);
                    $(that).css('font-family',fonts[i]);
                    if ++i >= 5
                        i = 0
                ), 200
            , ->
                clearInterval(task.now)
            )



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
    app.directive 'showDetail', ->
        restrict: 'A'
        link: (scope, element, attrs) ->
            $target = $('.bk-'+ attrs.showDetail)
            $(element).hover( ->
                if $(window).width() > 768
                    $target.addClass('active');
                    $('.round').not($(this)).addClass('fadeout');
            ->
                if $(window).width() > 768
                    $target.removeClass('active');
                    $('.round').not($(this)).removeClass('fadeout');
            )
    app.directive 'vgGo', ->
        restrict: 'A'
        link: (scope, element, attrs) ->
            $(element).click ->
                window.location.href = attrs.vgGo;

    parseTitle = (data) ->
        r =
            title:""
            type:""
            tag:""
            disc:""
            url:""
            hide:""
        month = '零 一 二 三 四 五 六 七 八 九 十 十一 十二'.split(' ')
        for line in data.split('\n')
            [key,value] = line.split(':')
            key = $.trim key
            value = $.trim value
            if r.hasOwnProperty(key) then r[key]=value
        r.date = r.url.split('-')
        r.date.month = month[parseInt r.date[1],10]
        r.date.day =  parseInt r.date[2],10
        return r

    parseList = (data) ->
        #console.log data.split(/\n[\-=]+/)
        r = []
        data = data.split(/\n[\-=]+/)
        data.forEach (list)->
            list = parseTitle(list)
            #剔除hide的的文章
            if list.hide isnt 'true' then r.push list
        return r

    parseType = (data) ->
        r = []
        data.forEach (list)->
            if r.indexOf(list.type) is -1
                r.push list.type
        return r


    parsePost = (text) ->
        flag = false
        head = ""
        tail = ""
        for line in text.split('\n')
            if /[\-=]+/.test(line)
                flag=true
            if flag
                tail+= '\n'+line
            else
                head+= '\n'+line+'\n'
        post = parseTitle head
        post.text = tail
        if post.hide == 'true' then return
        return post

    app.controller 'blogList', [
        '$scope', 
        '$http', 
        '$routeParams',
        '$rootScope',
        '$timeout',
        '$location',
        ($scope,$http,$routeParams,$rootScope, $timeout, $location) ->
            $scope.routeType = $routeParams.type || 'all'
            #console.log $scope.routeParams
            $http.get("/post/list.md").success (data) ->
                #解析博客列表，
                $scope.blogList = $scope.blogListOrigin= parseList(data)
                #解析博客分类
                $scope.listType = parseType($scope.blogList)

            $scope.changeType = ($event, type)->
                $event.preventDefault();
                $scope.routeType = type
                $scope.blogList = filterType($scope.blogListOrigin, type);
    ]

