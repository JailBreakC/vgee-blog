define ['jquery', 'angular'], ($, angular) ->
    app = angular.module 'myblog'

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
            (a, b, c)->
            if r.hasOwnProperty(key) then r[key]=value
        r.date = r.url.split('-')
        r.date.month = month[parseInt r.date[1],10]
        r.date.day =  parseInt r.date[2],10
        return r

    parseList = (data) ->
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

            #主题加载
            $scope.percent = '0'
            $rootScope.$on('themeChangeStart', (e, data)->
                if(data.fake)
                    $scope.percent = '30'
                else
                    $scope.percent = '0'
            )
            $rootScope.$on('themeChangeSuccess', ->
                $scope.percent = '100'
            )
            $rootScope.$on('themeChangeProgress', (e, data)->
                $scope.percent = (data.loaded/data.total) * 100 + ''
                console.log($scope.percent)
            )

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
                    color: 'yellow'
                    selected: false
                },
                {
                    color: 'pink'
                    selected: false
                }
            ]

            $scope.themes.themeClass = 'theme-green' 
            
        ]

    app.controller 'bloglist', [
        '$rootScope'
        '$scope'
        '$http'
        '$stateParams'
        ($rootScope, $scope, $http, $stateParams) ->
            $scope.blogtype = $rootScope.blogtype = $stateParams.type

    ]   
    app.controller 'blogdetail', [
        '$scope'
        '$http'
        '$stateParams'
        '$timeout'
        '$location'
        ($scope, $http, $stateParams, $timeout, $location) ->
            $http.get('/post/' + $stateParams.article).success (data) ->
                data = parsePost(data)
                $scope.title = data.title
                $scope.article = data.text
                #添加多说评论框
                toggleDuoshuoComments('.blog-detail')
            toggleDuoshuoComments = (container) ->
                el = document.createElement('div') #该div不需要设置class="ds-thread"
                el.setAttribute('id', $location.url()) #必选参数
                el.setAttribute('data-thread-key', $scope.title) #必选参数
                el.setAttribute('data-url', $location.url()) #必选参数
                #el.setAttribute('data-author-key', '作者的本地用户ID');//可选参数
                #console.log(el)
                DUOSHUO.EmbedThread(el)
                #console.log(el)
                jQuery(container).append(el)
    ]
