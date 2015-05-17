title:html5QQClient
disc:使用HTML5+ 开发的第三方手机QQ客户端
type:project
------------------
#使用HTML5+ 开发的第三方手机QQ客户端

代码地址 [https://github.com/JailBreakC/HTML5QQclient](https://github.com/JailBreakC/HTML5QQclient)

##概述

使用HTML5+ 来实现这个QQ客户端还得从 [HBuilder](http://www.dcloud.io/) 这个编辑器开始说起

其实从上个学期开始我就有接触过这款编辑器。听说语法补全功能特别
好用我就试了试，后来居然发现这个IDE居然可以生成APP，于是乘着
新鲜劲就捣鼓了几天。发现好像的确不错的样子。但是由于HBuilder实在是
有点慢，用了两天受不了，又转回了sublime，没有继续深入学习了下去。

后来因为这个学期学校居然天杀的开了个安卓课（JAVA都还没学过）。课程设计
需要做一个安卓APP，我就想起了HBuilder，回来一看，东西更新了不少，
还出现了一个MUI框架，这个框架的存在很大程度上决定了我开始使用这一套框架
的理由,它集成了一套非常轻便的UI，而且封装了常用的 [html5+ api](http://www.html5plus.org/#specification#/specification/Accelerometer.html),
用起来感觉挺爽。把玩了一下官方给的demo APP 发现流畅度不错。正好学弟那里有个
古老的QQ API可以用，于是就决定课程设计就做个QQ手机客户端了。

-----------------------

##HOW

之所以能在安卓机上面做到不卡，最主要的还是靠webview这个东西，
专场动画啊，上拉下拉啊，如果靠CSS + DIV来做的话那在稍微低端一点的
安卓机上面绝对是卡的一比。谈不上任何体验。但是通过把页面拆成多个
webview的方法，将动画效果交给原生去实现，那情况就会好很多。
然后再通过HTML5plus提供的各种原生API接口，似乎使用javascript就能
在手机上无所不能了。

![html+](http://vgee.sinaapp.com/post/img/html5plus.jpg)

把 [mui的文档](http://dcloudio.github.io/mui/) 翻看了一遍，然后就开始着手写这个APP

首先是仿照微信做一个选项卡界面。

![mainPage](http://vgee.sinaapp.com/post/img/html5QQClient4.jpg)。

这个界面用了5个webview, 主webview是上标题栏和底栏。中间是空白的。

然后是四个子webview，分别来显示四个不同的界面。

        var subpages = [
        'tab-webview-subpage-chat.html',
        'tab-webview-subpage-contact.html',
        'tab-webview-subpage-about.html',
        'tab-webview-subpage-setting.html'
        ];
        var subpage_style = {
            top: '46px',
            bottom: '50px'
        };
        var islogged = 0;
        //创建子页面，首个选项卡页面显示，其它均隐藏；
        mui.plusReady(function(){
            var self = plus.webview.currentWebview();
            for(var i=0;i<4;i++){
                var sub = plus.webview.create(subpages[i],subpages[i],subpage_style);
                if(i>0){
                    sub.hide();
                }
                self.append(sub);
            }
            self.show();
            mui.preload({
                url: 'dialog.html', 
                id:'dialog'
            });

使用了这么多webview接下来就是webview之间的通信问题。

html5+给我们提供的方法就是事件。我们可以用向不同的webview发送事件的方式
来传递消息。`mui.fire(contactPage, 'refreshFrient', {data:data});` 
就像这样。

但是我个人感觉这种方式真的是非常麻烦。通信的时候需要各种fire和listener.
这我是感觉非常不爽的一点。

再看一下其他的几个界面的效果

![mainPage](http://vgee.sinaapp.com/post/img/html5QQClient1.jpg)

![mainPage](http://vgee.sinaapp.com/post/img/html5QQClient2.jpg)

![mainPage](http://vgee.sinaapp.com/post/img/html5QQClient3.jpg)

这个聊天对话界面用了点小技巧。

因为手机系统的限制，在web页面中只有当点击input框的时候，软键盘才会弹出，而且当点击
任何非input区域的时候，软键盘就会立马的收起，而且我没有找到任何一个关于软键盘的事件。
但是这样问题就来了，当点击发送button的时候，软键盘立马就会收起，然后发送另一条消息
的时候又要再点击一下input区域，这样非常非常非常不爽。

于是。。。我只好用一个非常奇葩的办法去解决问题。
将一个input框做成button的样式，就像图片上发送按钮那样，然后每次点击它时，立马又
focus到原来的输入框里面去。这样软键盘就不会收起。亲测有效，非常爽。。。

##总结

就过自己的使用情况来看，HTML5+可以说是做的越来越好了，但是在性能上还是与原生的APP有着
很大的差距。在我的使用中，只要页面中包含图片数量稍微多一点。在安卓机器上，转场动画
就会开始各种卡顿。最后弄得我只敢在动画结束之后才显示图片。还有就是HBuilder的速度也
实在是让人堪忧，i5+ 固态的机器，敲起代码来一卡一卡的，要不是需要调试，我真想换回我
捷迅如飞的大sublime啊。。。