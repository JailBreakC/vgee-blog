title: 响应式页面终极实战
disc: 使用CSS3 REM 和 VW 打造等比例响应式页面的便捷工作流
type:css
------------------


在 HTML5 时代，响应式设计是前端开发以及网页设计所关注的一个重点方向，业界非常著名（已经被用烂了）的 CSS 框架 Bootstrap 采用的就是 @media 媒体查询方式的响应式。当使用媒体查询时候我们会设定一系列的响应点，来应用不同的 CSS 样式，比如下面这样

```css
@media screen and (min-width: 960px) {
  font-size: 20px;
}

@media screen and (max-width: 960px) and (min-width: 500px) {
  font-size: 16px;
}

@media screen and (max-width: 500px) {
  font-size: 14px;
}
```

在三种不同的页面尺寸范围，应用了三套不同的字体大小来适应页面布局。

但是上述方法有一个弊端，首先就是编写起来比较繁琐，我们要给每一个宽度范围都设定一套 CSS 规则，然后当想要对范围进行更细粒度的响应的时候，不得不去增加响应范围的数量。

## 使用 REM

在 PC 端页面开发的时候媒体查询通常可以很好地满足需求，但是移动端页面分辨率错综复杂，媒体查询似乎不太能很好地满足需求，在 web app 迅猛发展的时代，很多厂商已经开始采用 rem 来实现更加强大的屏幕适配布局，在前几年，rem 还是个比较冷门的属性，再加上兼容性比较差，所以并没有广泛应用，但目前随着浏览器对 CSS3 新特性支持的进一步完善，以及 web app 的发展，rem 已经被很多厂商广泛使用。

本篇文章不对 rem 进行深入介绍，不了解 rem 的同学可以先看这篇文章 [web app 变革之rem](http://520ued.com/article/549125815f85b6b44ca20b2b) 。在字体大小/宽度/边距等属性上面使用 rem 作为单位，然后这些属性的值就会和根节点，也就是 HTML 标签的 font-size 成比例。 比如：

```css
html {
	font-size: 14px;
}
h1 {
	font-size: 2rem;   // 此时对应的 font-size 转换过来即 28px:
	padding-top: 1rem; // 同理为 14px
}
```

有了这样的比例对应关系，接下来我们只需求试时的修改 html 标签上的字体大小就可以了。

比如通过 JS:

```javascript
(function (doc, win) {
  var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
      };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
```

或者 @media 媒体查询

```css
	html {
   		font-size : 20px;
	}
	@media only screen and (min-width: 401px){
	    html {
	        font-size: 25px !important;
	    }
	}
	@media only screen and (min-width: 428px){
	    html {
	        font-size: 26.75px !important;
	    }
	}
	@media only screen and (min-width: 481px){
	    html {
	        font-size: 30px !important; 
	    }
	}
	@media only screen and (min-width: 569px){
	    html {
	        font-size: 35px !important; 
	    }
	}
	@media only screen and (min-width: 641px){
	    html {
	        font-size: 40px !important; 
	    }
	}
```

## 等比例响应 VW

不过，这两种方法看起来也不是特别的完美，媒体查询依然不能做到的等比例响应，JS 的话总觉得用起来不舒服，毕竟子曾经曰过的「能用 css 解决的事情，绝对不用 js 解决」。

（老湿啊，能不能再给力一点啊。）

是时候介绍一下今天两大主角的另外一个了：VW，VW 也是一个 CSS3 新增的值类型，他和 vh，vm 是三兄弟

- vw: 相对于视窗的宽度，视窗的宽度是100vw
- vh: 相对于视窗的高度，视窗的高度是100vh
- vm: 相对于视窗的高度或官渡，取决于哪个更小

如果要根据屏幕宽度自适应的话，现在我们只需要给 HTML 元素设定一个 vw 单位的 font-size 就可以完美解决问题了。

```css
html {
	font-size: 4.375vw;
}
```

为什么我这里要 设定为 4.375vw 呢，4.375vw 在视窗宽度为 320px 的时候，正好是 14px (14 / 320 = 0.04375)。 而我的项目中的页面默认字体大小就是14px。好了，现在页面上所有以 rem 为单位的属性都会随着屏幕的宽度变化而自动响应等比变化。（终于舒坦了。）

设计师只要设计好320px 宽度页面样式。将需要响应的 CSS 属性设定为对应的 rem 值，页面就会按照你想要样子按视窗宽度响应显示。

```CSS
html {
	font-size: 4.375vw;
}
p {
	font-size: 1rem;   // 设计稿上为 14px
	padding-top: 2rem: // 设计稿上为 28px
}
```

到这里就结束了？

no no no。

当把这套流程用到项目中的时候，前端同学就会发现，设计师同学给的标注都是 px 的啊，还要自己手动转换成 rem ，每次还要调个计算器出来很抓狂。

别急，还有招。

##  使用 LESS px 自动转 rem

相信现在写前端的同学都应该脱离了刀耕火种的直接编写 CSS 的时代，投入了 LESS/SASS/Stylus 等 CSS 预处理器的怀抱中去了。

有了这些就好说了，下面我们用 LESS 来帮我做一点微小的事情，自动转换 px to rem。

LESS Mixin:

```less
.font-size(@sizeValue) {
    @remValue: @sizeValue / 14;
    font-size: ~"@{remValue}rem";
}
.px-to-rem(@sizeValue:14) {
    @remValue: @sizeValue / 14;
    @pxToRem: ~"@{remValue}rem";
}
```

使用方法

```less
p {
	.font-size(18);
	
	.px-to-rem(80);
	padding-top: @pxToRem;
}

// 注意，当你在同一个大括号作用于中使用多次 .px-to-rem Mixin 时，
// 会造成值覆盖的情况，这时候要使用增加一层大括号的方式，来隔离作用域。

// Bad！ 反面示例
h1 {
	.px-to-rem(20);
	padding-top: @pxToRem;
	.px-to-rem(80);
	padding-bottom: @pxToRem;
}

// Good！ 正面示例

h1 {
	& {
		.px-to-rem(20);
		padding-top: @pxToRem;
	}
	& {
		.px-to-rem(80);
		padding-bottom: @pxToRem;
	}
}

```

生成的 CSS

```css
p {
    font-size: 1.2857142857142858rem;
    padding-top: 5.714285714285714rem;
}


// Bad result！ 反面示例结果
h1 {
	padding-top: 5.714285714285714rem;
	padding-bottom: 5.714285714285714rem; //被上一个覆盖
}

// Good result！ 正面示例结果

h1 {
	padding-top: 5.714285714285714rem;
	padding-bottom: 1.4285714285714286rem;
}

```

好了，解决了这些烦人的东西，现在我们终于可以舒舒服服的去实现一个等比响应的 web 页面了。🙄

Author : JailBreak <http://vgee.cn>















