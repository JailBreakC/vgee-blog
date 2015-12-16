var API = {
    get: 'http://5.vgee.sinaapp.com/s1/jsonp.php?callback=?',
    post: 'http://5.vgee.sinaapp.com/s1/jsonpost.php?callback=?'
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
        $.each(data, function(i, msg) {
            if(msg.wall_first) {
                msg.wall_message = msg.wall_first + '\n\n' + msg.wall_sec;
            }
            if(!msg.wall_city) {
                msg.wall_city = '未知';
            }
            if(!msg.wall_weither) {
                msg.wall_weither = '未知';
            }
            var time = msg.wall_addtime.split('_')[0].split('-')
            time.shift();
            time = time.join('/');
            time += ' ' + msg.wall_addtime.split('_')[1].slice(0, -3)
            console.log(time);
            var icon = icons[msg.wall_w_icon] || '&#xe604;'
            var noImg = msg.wall_img ? '': 'no-img';
            //替换特殊标识为换行符
            var massage = msg.wall_message.replace(/\/_rt\//g, '\n');
            var htmlStr = [
            '<div class="container '+noImg+'">',
                '<div class="pic-ct">',
                    '<img src="'+msg.wall_img+'" alt="">',
                '</div>',
                '<div class="text-ct">',
                    '<pre>'+massage+'</pre>',
                    '<p class="user">-- <span>'+msg.wall_author+'</span></p>',
                    '<div class="acts">',
                        '<div class="act">',
                            '<i class="iconfont">'+icon+'</i>    ',
                            '<p>'+msg.wall_weither+'</p>',
                        '</div>',
                        '<div class="act">',
                            '<i class="iconfont">&#xe60b;</i>',
                            '<p>'+time+'</p>',
                        '</div>',
                        '<div class="act">',
                            '<i class="iconfont location">&#xe60c;</i>',
                            '<p>'+msg.wall_city+'</p>',
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
