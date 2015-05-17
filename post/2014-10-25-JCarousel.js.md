title:JCarousel.js
disc:自己编写的原生JavaScript轮播插件
type:project
------------------

使用原生的JavaScript实现一个功能完善的轮播插件

暂时只实现了前后滚动轮播，可以设置每次显示的图片数.

API: 引入JCarousel.js文件，在文档加载完成之后执行

    JCarousel(box, container, showNum, moveNum)

    box 外层盒子

    container元素包裹框

    [showNum]屏幕显示的元素数 默认1

    [moveNum]一次性移动的元素数 默认1

    Todo: -触摸事件 -动画缓动参数设置 -界面美化

这里只介绍一下缓动部分的代码，源代码可以去我的Github查看。

        var Scroller = function() {
            var isFnBeingDone = 1;      //标记回调函数的状态,保证动画结束或者中途终止之后执行回调。
            return function (ele, attr, target, fn) {
                clearInterval(ele.timer);
                if(!isFnBeingDone){
                    //console.log('Act stop in half way');
                    //console.log('Run the func');
                    fn && fn();
                }
                isFnBeingDone = 0;
                ele.timer = setInterval(function () {
                    var cur = 0;
                    cur = parseInt(ele.style[attr], 10);
                    var speed = (target - cur) / 8; //实现从快到慢的速度转变
                    speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                    if (cur === target) {
                        clearInterval(ele.timer);
                        //console.log('run the func');
                        fn && fn();
                        isFnBeingDone = 1;
                    } else {
                        ele.style[attr] = speed + cur + 'px';
                    }
                }, 30);
            };
        };

        var act = Scroller();

这里我使用了一个构造函数来创建act函数，主要是注意维护了一个状态 `isFnBeingDone`，
使得回调函数不管在动画结束还是动画终端的时候都会执行回调函数。