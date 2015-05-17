title:如何编写高扩展且可维护的 JavaScript
disc:如何编写高扩展且可维护的 JavaScript ：模块
type:JavaScript
------------------

##通常的 JavaScript 模块

使用原生 JavaScript 实现模块是相对容易的，但是已经存在很多的模式随便你使用。每种模式可以说是各有利弊。这里会包含这些模式中的几个，但没有顾及那个最适合你的选择。多数时候，会取决于你的偏好以及哪个在你指定的场景下工作的最好。对于哪个模块实现是最好的，网上没有什么明确的意见。所以，如果不确定可以随便去搜索一下。

##我们现在开始。

JavaScript 模块可以像 JavaScript 对象一样的简单，对象的原型就是功能上独立的单元，也就是函数。请注意没有闭包，这个模块实例可能会污染全局命名空间。

##实例：POJO 模块模式

    var myModule = {
        propertyEx: "This is a property on myModule",    
        functionEx: function(){ 
            //在这里插入代码 
        } 
    }; 

为了创建闭包，并且确保所有的变量和函数都是这个模块局部的，通常业内会用一个 IIFE（立即执行的函数表达式）包裹这个模块，这与前面提到的对象方法很类似。

##实例：Scoped 模块模式

    var myModule = (function () { 
        var module;
        module.varProperty = "This is a property on myModule";
        module.funcProperty = function(){ 
            //在这里插入代码
        };
        return module; 
    })(); 

另一种模式是模块模式，连同所谓的暴露模块模式。暴露模块模式只是模块模式的一个特例，实现了一种形式的私有成员，这样仅仅暴漏了一个公共接口。下面是暴露模块模式的的一个实例。

##实例：暴露模块模式

    var myRevealingModule = (function () {
    var privateVar = "Alex Castrounis",
        publicVar  = "Hi!";

    function privateFunction() {
        console.log( "Name:" + privateVar );
    }

    function publicSetName( strName ) {
        privateVar = strName;
    }

    function publicGetName() {
        privateFunction();
    }

    return {
        setName: publicSetName,
        greeting: publicVar,
        getName: publicGetName
    }; 

    })(); 

我要说的最后一个普遍的 JavaScript 模式是原型模式。和前面描述的模块模式类似，但是使用了 JavaScript 原型。下面是一个带有私有成员基于原型模式的模块的一个实例。

##实例：原型模式

    var myPrototypeModule = (function (){
    var privateVar = "Alex Castrounis",
        count = 0;

    function PrototypeModule(name){
        this.name = name;
    }

    function privateFunction() {
        console.log( "Name:" + privateVar );
        count++;
    }

    PrototypeModule.prototype.setName = function(strName){
        this.name = strName;
    };

    PrototypeModule.prototype.getName = function(){
        privateFunction();
    };

    return PrototypeModule;     

    })();

我们详细讲述了多种原生 JavaScript 的模块实现方式，也主要探索了三个主要的模块格式和规范。当然也包括了即将到来的原生 ECMAScript 模块规范，但只是一个雏形，我强烈建议去选择自己最有感觉的模块模式或者规范。一旦决定了一个模块规范，并且确保在你的项目中的统一性。统一是可维护性的一个关键要素。

转自知乎日报,有删减[http://zhuanlan.zhihu.com/FrontendMagazine/19884662](http://zhuanlan.zhihu.com/FrontendMagazine/19884662)