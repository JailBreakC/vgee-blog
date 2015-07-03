requirejs.config
    paths:
        'angular': '../build/lib/angular-route-animate.min'
        'jquery': '../build/lib/jquery.min'
        'bootstrap': '../build/lib/bootstrap.min'
        'markdown': '../build/lib/markdown.min'
        'hljs': '../build/lib/highlight.pack'
        #'skel': '../build/lib/skel.min'
    shim: 
        'angular':
            exports: 'angular'
        'bootstrap':
            deps: ['jquery'],
            exports: 'bootstrap'
        'markdown':
            exports: 'markdown'


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
        'ui.router'
        'ngAnimate'
    ]
    app.config [
        '$stateProvider',
        '$urlRouterProvider',
        ($stateProvider, $urlRouterProvider) -> 
            $stateProvider.state('main', 
                url: '/',
                templateUrl: '/template/page-main.html'
            ).state('cv',
                url: '/cv',
                templateUrl: '/template/page-cv.html'
            ).state('contact',
                url: '/contact',
                templateUrl: '/template/page-msg.html'
            ).state('project',
                url: '/project',
                templateUrl: '/template/page-project.html'
            ).state('blog',
                url: '/blog',
                templateUrl: '/template/page-blog.html',
                controller: 'blog'
            ).state('blog.list',
                url: '/:type',
                templateUrl: '/template/page-blog-list.html',
                controller: 'bloglist'
            ).state('blog.detail',
                url: '/post/:article',
                templateUrl: '/template/page-blog-detail.html',
                controller: 'blogdetail'
            )

            $urlRouterProvider.otherwise('/');
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

    app.directive 'markdown', ->
        restrict: 'A'
        scope: {
            content: '=markdownText'
        },
        link: (scope, element, attrs)-> 
            them = if attrs.theme then attrs.theme else 'zenburn'
            cssUrl = require.toUrl('/style/lib/hightlight/' + them + '.css')
            link = document.createElement('link')
            link.type = 'text/css'
            link.rel = 'stylesheet'
            link.href = cssUrl
            document.getElementsByTagName('head')[0].appendChild(link);
            loading = '<div class="spinner">
                          <div class="rect1"></div>
                          <div class="rect2"></div>
                          <div class="rect3"></div>
                          <div class="rect4"></div>
                          <div class="rect5"></div>
                      </div>'
            #动态加载markdown 和 highlight 
            requirejs ['markdown', 'hljs'], (md, hljs) ->
                scope.$watch( ->
                    return scope.content
                , (newValue)->
                    if newValue
                        element.html md.toHTML(newValue)
                        $(element).find('pre>code').each (i, block) ->
                           return hljs.highlightBlock block
                    else
                        element.html loading

                )
                element.html md.toHTML(scope.content)
                $(element).find('pre>code').each (i, block) ->
                   return hljs.highlightBlock block
    

    parseTitle = (data) ->
        r =
            title:''
            type:''
            tag:''
            disc:''
            url:''
            hide:''
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
        head = ''
        tail = '' 
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

    app.controller 'blog', [
        '$scope'
        '$http'
        '$rootScope'
        '$timeout'
        '$location'
        '$stateParams'
        ($scope,$http,$rootScope, $timeout, $location, $stateParams) ->
            ##$scope.routeType = $routeParams.type || 'all'
            $http.get('/post/list.md').success (data) ->
                #解析博客列表，
                $scope.blogList = $scope.blogListOrigin= parseList(data)
                #解析博客分类
                $scope.listType = parseType($scope.blogList)

            $scope.changethemes = (index) -> 
                $scope.themes.forEach (v) ->
                    v.selected = false;            
                $scope.themes[index].selected = true;
                $scope.themeclass = 'theme-' + $scope.themes[index].color
                enterEle = '<div class="header-background bg-enter" style="background: url(/img/0' + (index + 1) + '.jpg) no-repeat;background-size: cover;"></div>'
                leaveEle = $('.c-blog > .header').find('.header-background')
                leaveEle.removeClass('bg-enter').addClass('bg-leave')
                setTimeout(->
                    leaveEle.remove();
                , 1000)
                $(enterEle).appendTo('.c-blog > .header') 
                
                

            $scope.themes = [
                {
                    color: 'green'
                    selected: true
                },
                {
                    color: 'blue'
                    selected: false
                },
                {
                    color: 'purple'
                    selected: false
                },
                {
                    color: 'yello'
                    selected: false
                },
                {
                    color: 'pink'
                    selected: false
                },
            ]
    ]

    app.controller 'bloglist', [
        '$scope'
        '$rootScope'
        '$http'
        '$stateParams'
        ($rootScope, $scope, $http, $stateParams) ->
            console.log $scope.blogtype = $rootScope.$parent.$parent.blogtype = $stateParams.type

    ]   
    app.controller 'blogdetail', [
        '$scope'
        '$http'
        '$stateParams'
        ($scope, $http, $stateParams) ->
            $http.get('/post/' + $stateParams.article).success (data) ->
                data = parsePost(data)
                $scope.title = data.title
                $scope.article = data.text
    ]

