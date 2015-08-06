define ['jquery', 'angular'], ($, angular) ->
    app = angular.module 'myblog'

    #博客列表的动画，滚动时在下方出现
    app.directive 'celAnimate',['$rootScope', ($rootScope) ->
        restrict: 'EA'
        link: (scope,element,attrs) ->
            if $(window).width() < 768 then return
            $(element).addClass('cel-hide')
            scrollCheck = 0
            animationCheck = ->
                if $(element).hasClass('cel-show') then return

                height = $(window).height()
                top = $(window).scrollTop()
                pos = $(element).offset().top
                if pos - top <= height
                    $(element).removeClass('cel-hide').addClass('cel-show')
                scrollCheck = 1
            #初始化首次检测
            animationCheck()
            #滚动式检测动画
            $(window).scroll ->
                scrollCheck = 0
                
            #页面切换时，检测动画
            $rootScope.$on('$routeChangeSuccess', ->
                setTimeout ->
                    animationCheck()
            )
            #节流，每200毫秒执行一次滚动动画检测
            setInterval( ->
                if scrollCheck == 0
                    animationCheck()
            , 200)
        ]

    #模拟 css background-size: cover ， 让元素本身也能相对于窗口cover
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

    #滚动时主标题文字变大变虚
    app.directive 'scrollFade', ->
        restrict: 'A'
        link: (scope, element, attrs) ->
            if $(window).width() < 768 then return
            $ele = $(element)
            $window = $(window)
            eHeight = $ele.height()
            eTop = $ele.offset().top
            $window.scroll ->
                wTop = $window.scrollTop()
                if wTop > eTop && wTop - eTop <= eHeight * 2
                    size = (wTop - eTop) / (eHeight * 2) + 1
                    opacity = 1 - (wTop - eTop) / (eHeight * 2)
                    $ele.css({'transform': 'scale('+size+')', 'opacity': opacity})


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
            cssUrl = require.toUrl('/app/assets/css/lib/highlight/' + them + '.css')
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
            
            element.html loading
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
                if scope.content
                    element.html md.toHTML(scope.content)
                    $(element).find('pre>code').each (i, block) ->
                       return hljs.highlightBlock block
                else
                    element.html loading

    app.directive 'themeSwitcher', ->
        restrict: 'E'
        scope: {
            themes: '=themes'
        }
        link: (scope, element, attr)->
            if not localStorage.getItem('theme')
                localStorage.setItem('theme', 'green')

        controller: ['$scope', '$rootScope', '$timeout', '$http', ($scope, $rootScope, $timeout, $http)->
            themes = []
            picsize = '1080x1800'
            if $(window).width() < 500
                picsize = '500x500xz'
            imgs = 
                'green': 'http://gtms01.alicdn.com/tps/i1/TB1I3coIFXXXXaOXpXXxjZKVXXX-1200-675.jpg_' + picsize + '.jpg'
                'pink': 'http://gtms03.alicdn.com/tps/i3/TB1CUj9IFXXXXbNaXXX9l.7UFXX-1920-1080.jpg_' + picsize + '.jpg'
                'purple': 'http://gtms04.alicdn.com/tps/i4/TB1euAmIFXXXXbnXpXX9l.7UFXX-1920-1080.jpg_' + picsize + '.jpg'
                'blue': 'http://gtms01.alicdn.com/tps/i1/TB1jEEuIFXXXXXrXXXX9l.7UFXX-1920-1080.jpg_' + picsize + '.jpg'
                'yellow': 'http://gtms03.alicdn.com/tps/i3/TB1e4EaIFXXXXcuXVXX9l.7UFXX-1920-1080.jpg_' + picsize + '.jpg'

            this.gotChanged = (theme)->
                changeTheme = ->
                    themes.forEach (v) ->
                        if v != theme
                            v.selected = false;
                    #切换全局主题名        
                    $scope.themes.themeClass = 'theme-' + theme.color
                    #保存主题
                    localStorage.setItem('theme', theme.color)
                    theme.loaded = true
                    background = 'url(' + theme.url + ')'
                    enterEle = $('.header-background.bg-leave')
                    leaveEle = $('.header-background.bg-enter')
                    leaveEle.removeClass('bg-enter').addClass('bg-leave')
                    enterEle.removeClass('bg-leave').addClass('bg-enter').css('background-image', background)
                    $rootScope.$broadcast('themeChangeSuccess')
                #如果主题已加载，直接切换
                if theme.loaded
                    changeTheme()
                    return
                #预加载图片
                theme.img = new Image()
                #判断浏览器支持 如果支持xhr2 则使用加载blob的方法加载图片
                if window.URL.createObjectURL
                    $rootScope.$broadcast('themeChangeStart', {'fake': false})
                    xhr = new XMLHttpRequest()
                    xhr.open('GET', imgs[theme.color])
                    xhr.responseType = 'blob'
                    xhr.onreadystatechange = ->
                        if xhr.readyState is 4
                            theme.url = window.URL.createObjectURL(xhr.response)
                    xhr.onprogress = (e) ->
                        #需要将逻辑包进$rootScope.$apply 否则angular无法进行双向绑定！！！
                        $rootScope.$apply ->
                            $rootScope.$broadcast('themeChangeProgress', e)
                    xhr.send()
                else  
                    $rootScope.$broadcast('themeChangeStart', {'fake': true})
                    theme.img.src = theme.url = imgs[theme.color]
                xhr.onload = theme.img.onload = changeTheme

            this.addThemes = (e) ->
                themes.push(e)
            return
        ] 

    app.directive 'switcher', ['$rootScope', '$timeout', ($rootScope, $timeout) ->
        restrict: 'EA'
        template: '<i ng-click="toggleTheme()" class="{{theme.selected ? \'active\' : \'\'}} glyphicon glyphicon-sunglasses"></i>'
        replace: true,
        transclude: true,
        require: '^themeSwitcher'
        scope: {
            theme: '=tm'
        }
        link: (scope,element,attr,themeSwitcherController) ->
            scope.theme.selected = false
            nowtheme = localStorage.getItem('theme')
            themeSwitcherController.addThemes(scope.theme);
            scope.toggleTheme = ->
                scope.theme.selected = true;
                themeSwitcherController.gotChanged(scope.theme)
            #首次主题设定
            if nowtheme is scope.theme.color
                scope.toggleTheme()

    ]

    app.directive 'progressTool', ['$rootScope', '$timeout', ($rootScope, $timeout) ->
        restrict: 'EA'
        replace: true
        template: '<div class="progress {{mhide}}">
                      <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="{{percent}}" aria-valuemin="0" aria-valuemax="100" style="width: {{percent}}%;">
                        <span class="{{showPercent ? \'\' : \'sr-only\'}}">{{percent}}%</span>
                      </div>
                    </div>'
        scope: {
            percent: '=percent'
            showPercent: '=showPercent'
        }
        link: (scope, element, attrs) ->
            scope.mhide = ''
            scope.percent += ''
            scope.$watch( ->
                scope.percent
            , ->
                if scope.percent is '100'
                    #必须要用$timeout而不是setTimeout，否则双向绑定会失效
                    $timeout( ->
                        scope.percent = '0'
                        scope.mhide = 'hide'               
                    , 500)
                    $timeout( ->
                        scope.mhide = ''
                    , 800)
            )
    ]