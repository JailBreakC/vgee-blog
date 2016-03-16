var API = {
    get: 'http://api.vgee.cn/msg',
    post: 'http://api.vgee.cn/msg',
    policy: 'http://api.vgee.cn/policy'
}

var icons = {
    '01': '&#xe604;',
    '02': '&#xe603;',
    '03': '&#xe606;',
    '04': '&#xe601;',
    '09': '&#xe600;',
    '10': '&#xe607;',
    '11': '&#xe602;',
    '13': '&#xe608;',
    '50': '&#xe605;'
}

var getData = function() {
    var content = [];
    $.getJSON(API.get).success(function(data) {
        if(data.flag != true) {
            alert('服务器发生了一个错误，请联系贝爷');
            return;
        }
        data = data.data;
        console.log(data);
        $.each(data, function(i, msg) {
            if(msg.first) {
                msg.message = msg.first + '\n\n' + msg.sec;
            }
            if(!msg.city) {
                msg.city = '未知';
            }
            if(!msg.weither) {
                msg.weither = '未知';
            }
            var front0 = function (num) {
                return num = num < 10 ? '0' + num : num;
            }

            var time = new Date(msg.createdAt);

            time = (time.getMonth() + 1) + '/' + time.getDate() + ' ' 
                   + front0(time.getHours()) + ':' + front0(time.getMinutes());

            var icon = icons[msg.weither_icon] || '&#xe604;'
            var noImg = msg.img ? '': 'no-img';
            //替换特殊标识为换行符
            var massage = msg.message.replace(/\/_rt\//g, '\n');
            
            var htmlStr = [
            '<div class="container '+noImg+'">',
                '<div class="pic-ct">',
                    '<img src="'+msg.img+'" alt="">',
                '</div>',
                '<div class="text-ct">',
                    '<pre>'+massage+'</pre>',
                    '<p class="user">-- <span>'+msg.author+'</span></p>',
                    '<div class="acts">',
                        '<div class="act">',
                            '<i class="iconfont">'+icon+'</i>    ',
                            '<p>'+msg.weither+'</p>',
                        '</div>',
                        '<div class="act">',
                            '<i class="iconfont">&#xe60b;</i>',
                            '<p>'+time+'</p>',
                        '</div>',
                        '<div class="act">',
                            '<i class="iconfont location">&#xe60c;</i>',
                            '<p>'+msg.city+'</p>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
            ]
            htmlStr = htmlStr.join('\n');
            content.push(htmlStr)
        })
        $('.big-ct').html(content.join('\n'));
    })
}

$(function() {

    getData();

});
