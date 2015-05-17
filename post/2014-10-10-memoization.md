title:Memoization
disc:JavaScript实现记忆化方法
type:JavaScript
------------------

编写一个函数来帮至我们构造带记忆功能的函数

    var memoizer = function (memo, formula) {
        var recur = function (n) {
            var result = memo[n];
            if (typeof result !== 'number') {
                result = formula (recur, n);
                memo[n] = result;
            }
            return result;
        };
        return recur;
    };

    //斐波那契
    var fibonacci = memoizer([0, 1], function (recur, n) {
        return recur (n - 1) + recur (n - 2);
    });
    fibnaacci(n);

    //阶乘
    var factorial = memoizer([1, 1], function (recur, n) {
        return n * recur (n - 1);
    })
    factorial(n);