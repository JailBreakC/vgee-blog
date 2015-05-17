title:hasOwnProperty
disc:hasOwnProperty 过滤器
type:JavaScript
------------------

for in 语句可用来遍历一个对象中的所有属性名。该枚举过程将会列出所有的属性——包括函数和你可能不关心的原型中的属性——所以有必要过滤掉那些你不想要的值。最为常用的过滤器是 `hasOwnProperty` 方法，以及使用 `typeof` 来排除函数：

        
    var name;
    for (name in another_stooge) {
        if (another_stooge.hasOwnProperty(name)) {
            document.writeln(name + ': ' + another_stooge[name]);
        }
    }

    var name;
    for (name in another_stooge) {
        if (typeof another_stooge[name] !== 'function') {
            document.writeln(name + ': ' + another_stooge[name]);
        }
    }