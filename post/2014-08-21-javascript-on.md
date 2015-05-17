title:JavaScript on 绑定方法
disc:使用on来绑定变化的dom元素
type:JavaScript
------------------
`.live()`的实践委托方法在jQuery 1.9 开始就被移除了，所以再用`.live()`方法就会报错

    .live() is not a function

`.live()`方法会把事件绑定到`$(document)`对象上面，而且不能修改，所以在嵌套比较深的情况下就会导致性能损失。
 
现在使用`.on(eventType, selector, function)`来代替`.live()`，用法如下:

    $('.myButton').live('click', function)

将元素`(.myButton`) 移动到`.on()`的 selector 属性上 然后找到最近的父元素`$('#parentElement').on('click', '.myButton', function)`
 
如果你不知道父节点是什么，那么body是肯定可用的

    $('body').on('click', '.myButton', function)
