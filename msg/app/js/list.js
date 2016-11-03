var getURLQuery = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var API = (function(){
    var devHOST = 'http://127.0.0.1:8888';
    var proHOST = 'http://api.vgee.cn';
    var HOST = getURLQuery('debug') == 'true' ? devHOST : proHOST;

    return {
        get: HOST + '/msg',
        post: HOST + '/msg',
        del: HOST + '/msg',
        policy: HOST + '/policy'
    }
})();

var checkPageMode = function() {
    if( getURLQuery('del') == 'true' ) {
        $('input[type="checkbox"]').show();
        $('.go-del').show().click(function() {
            deleteMessages();
        });
    }
}

var deleteMessages = function() {
    var getCheckedArr = function() {
        var checkedArr = [];
        $('input[type="checkbox"]').each(function(i, checkbox) {
            if(checkbox.checked == true) {
                checkedArr.push(checkbox.value);
            }
        })
        console.log(checkedArr);
        return checkedArr;
    }
    var sendDeleteReq = function() {
        $.ajax({
            url: API.del,
            type: 'DELETE',
            data: {
                ids: getCheckedArr().join(',')
            }
        }).success(function(res) {
            if(res.flag != true) {
                alert('delete fail');
                return;
            }
            window.location.reload();
        });
    }
    sendDeleteReq();
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

var DATA_LOADING = false;
var CURRECT_PAGE = 1;
var getData = function(page, count) {
    DATA_LOADING = true;
    $('.loading').show();
    var content = [];
    $.getJSON(API.get, {
        page: page || 1,
        count: count || 5
    }).success(function(data) {
        if(data.flag != true) {
            alert('服务器发生了一个错误，请联系贝爷');
            return;
        }
        CURRECT_PAGE++;
        data = data.data;
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
                    '<img class="lazy" src="'+msg.img+'" alt="">',
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
                        '<input style="display:none" value="'+ msg._id +'" type="checkbox">',
                    '</div>',
                '</div>',
            '</div>'
            ]
            htmlStr = htmlStr.join('\n');
            content.push(htmlStr)
        })
        $('.big-ct').append(content.join('\n'));

        checkPageMode();

    }).always(function() {
        DATA_LOADING = false;
        $('.loading').hide();
    })
}

$(function() {
    $(window).on('scroll', function() {
        if(!DATA_LOADING && $('body').scrollTop() >= $('body').height() - $(window).height()) {
            getData(CURRECT_PAGE);
        }
    })
    getData(CURRECT_PAGE);

});
