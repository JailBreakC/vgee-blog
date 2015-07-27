title:angularJS $rootscope.$apply()
disc:$rootscope.$apply() 与 angular 双向绑定机制
type:JavaScript
-------

####因为最近在开发博客，所以angular又捡起来了，在开发的过程中也遇到了不少问题。挑一个比较典型的来介绍一下

#### $rootscope.$apply() 

这个东西有什么用呢，我先介绍一下，angularJS 的重要特性之一就是双向绑定机制，可以将UI与控制器中的数据实时保持一致，免去了绝大部分对DOM的操作。
用起来相当的爽，双向绑定的实现机制是通过脏值检测的方法，所以Angular需要知道scope中的值什么时候变化了。通常Angular会检测DOM上的值变化，
还有各种Angular自带服务,比如$http等，但是有些时候比如在 setTimeout 中的值变化，angular是检测不到的，所以angular有一个代替的服务
$timeout，这个服务会将函数包装进$rootScope.$apply()。 但是有些时候，我们还是会再默写情况下改变$scope中的值，而且这时候没有可选的组件，
我们就需要自己来调用这个方法了。

比如这次我的博客中加载主题图片时，创建了一个img元素，然后绑定了onload方法，并且在中间改变了scope的值，这个时候我们就需要用到$rootScope.$apply()了，将函数包装进这个方法中，否则，scope中的值改变无法被检测到。

	#预加载图片
    bkimg = new Image()
    bkimg.src = imgs[theme.color]
    $(bkimg).load ->
        #需要将逻辑包进$rootScope.$apply 否则angular无法进行双向绑定！！！
        $rootScope.$apply ->
            themes.forEach (v) ->
                if v != theme
                    v.selected = false;
            #切换全局主题名        
            $scope.themes.themeClass = 'theme-' + theme.color
            background = 'url(' + imgs[theme.color] + ')'
            enterEle = $('.header-background.bg-leave')
            leaveEle = $('.header-background.bg-enter')
            leaveEle.removeClass('bg-enter').addClass('bg-leave')
            enterEle.removeClass('bg-leave').addClass('bg-enter').css('background-image', background)
            $rootScope.$broadcast('themeChangeSuccess')