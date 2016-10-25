title: sprity-krpano-xml
disc:Krpano 精灵图（雪碧图 || sprites）完美解决方案
type:krpano
------------------

做过全景开发的同学肯定都知道Krpano这个强大的全景引擎，目前可以说是最好的全景引擎之一, 不仅可以显示全景图片/视频，还能进行各种交互，还有 WebVR 模式、健全的工具体系等等。

krpano 为了兼容 HTML5 和 Flash，搞了一套自己的 krpano-xml 脚本语言，用这个来编写界面。

这边文章要讨论的问题就是，如何优雅的在 krpano-xml 中使用精灵图（雪碧图 || sprites）.

做全景播放器的时候，我们们通常会用到各种各样的图标，播放暂停啊，全屏VR啊什么的，如果每个图标都用单张图片来引入的话，势必会产生非常多的HTTP请求，而我们知道，过多的HTTP请求是页面性能的大杀器，还好 Krpano-xml 的 layer 提供了 crop 属性给我们，这个属性可以让我们对图片进行切割，只显示切割出来的区域，和 CSS 精灵图使用 background-image 和 background-position 来进行图片显示的方式非常类似。下面是 krpano crop 属性示例：


	<layer 
		name="some-image-layer"
		url="/foo/bar/image.png"
		crop="0|0|64|64"
		/>


上述代码的意思就是，从 x=0 y=0 坐标开始，截取图片的64x64宽高的区域来显示。所以，显示图片不同区域范围的代码就可以像下面这样：



	<layer 
		name="some-image-layer"
		url="/foo/bar/image.png"
		crop="0|0|64|64"
		/>

	<layer 
		name="other-image-layer"
		url="/foo/bar/image.png"
		crop="0|64|64|64"
		/>


现在我们有了 krpano 精灵图的使用方法，但是当你有很多张图片的时候，手动管理这些坐标点的位置是一件非常非常非常麻烦的事情。


CSS 精灵图已经有各种成熟的解决方案，比如博主喜欢的 gulp 插件 [sprity](https://npmjs.org/package/sprity) ，它可以一键拼合零碎图片，并且生成 CSS/LESS/SASS 代码，可惜 krpano-xml 相对来说太小众了，我找遍 google 并没有找到一个好的解决方案，所以是时候造个轮子了😁。


`sprity-krpano-xml` 是一个基于 sprity 的krpano-xml style 样式生成器。一键解决 krpano 精灵图部署问题。

<https://github.com/JailBreakC/sprity-krpano-xml>

强烈建议先阅读 [sprity](https://github.com/sprity/sprity) 的官方文档


# sprity-krpano-xml 中文文档


[![NPM version](https://badge.fury.io/js/sprity-krpano-xml.svg)](http://badge.fury.io/js/sprity-krpano-xml) [![Build Status](https://travis-ci.org/JailBreakC/sprity-krpano-xml.svg?branch=master)](https://travis-ci.org/JailBreakC/sprity-krpano-xml) [![Dependencies](https://david-dm.org/JailBreakC/sprity-krpano-xml.svg)](https://david-dm.org/JailBreakC/sprity-krpano-xml)


> 一个基于 [sprity](https://github.com/sprity/sprity) 的 krpano-xml style 样式生成器 


## 依赖


- [sprity](https://npmjs.org/package/sprity) version >= 1.0


## 安装


Install with [npm](https://npmjs.org/package/sprity-krpano-xml)


	npm install sprity sprity-krpano-xml --save-dev

全局使用 `sprity-krpano-xml` 请将 `sprity` 和 `sprity-krpano-xml` 一起全局安装


	npm install sprity sprity-krpano-xml -g


## 示例

JavaScript:


	var sprite = require('sprity');
	sprite.create({
	  ...
	  style: 'style.xml',
	  processor: 'krpano-xml'
	  cssPath: './images/dist/',
	  ...
	}, function () {
	  console.log('done');
	});


命令行:


	sprity out/ src/*.png -s style.xml -p krpano-xml


#### [krpano-xml style](http://krpano.com/docu/xml/#style) 示例


	<!-- the generated xml file (sprite.xml) -->
	<include url="sprite.xml" /> 

	<!-- camera icon (camera.png in src directory) -->
	<layer 
		name="the-camera-layer"
		style="icon-camera"
		/>

	<!-- cart icon (cart.png in src directory) -->
	<layer 
		name="the-cart-layer"
		style="icon-cart"
		/>

	<!-- load style in action -->
	<action name="set-layer-style">
		layer[the-camera-layer].loadstyle(icon-cart);
	</action>




## 更多

请查看 [sprity](https://npmjs.org/package/sprity) 文档

---

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sprity/sprity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)


#### 如果看完文档还不知怎么用的请看包教包会版⤵️


	var gulp = require('gulp'),
		gulpif = require('gulp-if'),
		sprity = require('sprity');

	// 合并图片，生成雪碧图
	gulp.task('sprites', function () {
	    return sprity.src({
	        src: './images/src/**/*.{png,jpg}',
	        style: 'sprite.xml',
	        margin: 6,
	        cssPath: './images/dist/',
	        orientation: 'binary-tree',
	        // 请确保已经 npm install sprity-krpano-xml
	        processor: 'krpano-xml', 
	    })
	    .pipe(gulpif('*.png', gulp.dest('./images/dist/'), gulp.dest('./krpano/')))
	    .on('end', function() {
	        console.log('end');
	    });
	});




----------------

# sprity-krpano-xml English version

[![NPM version](https://badge.fury.io/js/sprity-krpano-xml.svg)](http://badge.fury.io/js/sprity-krpano-xml) [![Build Status](https://travis-ci.org/JailBreakC/sprity-krpano-xml.svg?branch=master)](https://travis-ci.org/JailBreakC/sprity-krpano-xml) [![Dependencies](https://david-dm.org/JailBreakC/sprity-krpano-xml.svg)](https://david-dm.org/JailBreakC/sprity-krpano-xml)

> A krpano-xml style processor for [sprity](https://npmjs.org/package/sprity)

## Requirements

- [sprity](https://npmjs.org/package/sprity) version >= 1.0

## Install

Install with [npm](https://npmjs.org/package/sprity-krpano-xml)


	npm install sprity sprity-krpano-xml --save-dev


If you want to use `sprity-krpano-xml` with the command line interface of `sprity` install it globally.


	npm install sprity sprity-krpano-xml -g


## Usage

On commandline:


	sprity out/ src/*.png -s style.xml -p krpano-xml


In JavaScript:


	var sprite = require('sprity');
	sprite.create({
	  ...
	  style: 'style.xml',
	  processor: 'krpano-xml'
	  cssPath: './images/dist/',
	  ...
	}, function () {
	  console.log('done');
	});


#### [krpano-xml style](http://krpano.com/docu/xml/#style) usage example

xml
	<!-- the generated xml file (sprite.xml) -->
	<include url="sprite.xml" /> 

	<!-- camera icon (camera.png in src directory) -->
	<layer 
		name="the-camera-layer"
		style="icon-camera"
		/>

	<!-- cart icon (cart.png in src directory) -->
	<layer 
		name="the-cart-layer"
		style="icon-cart"
		/>

	<!-- load style in action -->
	<action name="set-layer-style">
		layer[the-camera-layer].loadstyle(icon-cart);
	</action>




## More

See [sprity](https://npmjs.org/package/sprity) documentation

---
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sprity/sprity?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)