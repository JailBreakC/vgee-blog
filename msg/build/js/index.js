var weitherAPI = 'http://api.openweathermap.org/data/2.5/weather?appid=2de143494c0b295cca9337e1e96b00e0&lang=zh&callback=?&q='
var transitionend = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";

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

var PICS = 20;

$.fn.toShow = function() {
    return $(this).removeClass('hide').addClass('show');
}
$.fn.toHide = function() {
    return $(this).removeClass('show').addClass('hide');
}

var loadUserMsg = function(cb) {
    var data = {},
        date = new Date();
        ipLoc = window.remote_ip_info;

    data.text = $('.edit #msg').val();
    data.location = ipLoc.city || ipLoc.province || '北京';
    data.time = date.getMonth() + 1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    var currentWeither = weitherAPI + data.location;

    $.getJSON(currentWeither).success(function(weither) {
        if(weither.cod == '404') {
            data.temp = 0;
            data.weither = '未知';
            return;
        }
        data.temp = (weither.main.temp - 273.15).toFixed(0);
        data.weither = weither.weather[0].description;
        data.w_icon = weither.weather[0].icon.slice(0,2);
        data.img = 'http://7xp0x5.com1.z0.glb.clouddn.com/photo'+Math.ceil(PICS * Math.random())+'.png'

    }).fail(function() {

        data.temp = '未知'

    }).done(function() {

        cb(data);

    });
}

var userData;

var postData = function(ele) {
    var wall_author = userData.user,
        wall_message = userData.text.replace(/\n/g, '/_rt/'),
        wall_weither = userData.weither,
        wall_city = userData.location;
        wall_w_icon = userData.w_icon;
        wall_img = userData.img;
    var param =  '&wall_author='+wall_author
                +'&wall_message='+wall_message
                +'&wall_weither='+wall_weither
                +'&wall_city='+wall_city
                +'&wall_w_icon='+wall_w_icon
                +'&wall_img='+wall_img;
    console.log(param);
    $.getJSON(API.post + param).success(function(data) {
        ele.waiting = false;
        if(data.success) {
            window.location.href="list.html"
        }else {
            alert(data);
        }
    })
}

var init = function() {

    $('#msg').textareaAutoSize().focus();

    $('.submit').click(function(e) {
        e.preventDefault();
        var user = Cookies.get('user');
        if(!user) {
            user = window.prompt('你叫什么呢？（小于10个字符)','');
            if(!user) {
                user = window.prompt('别淘气，你叫啥？','');
            }
            if(user.length > 10) {
                user = window.prompt('名字太非主流不好（小于10个字符)', user);
            }
            Cookies.set('user', user, { expires: 1000, path: '/' });
        }

        if(!$('.edit #msg').val()) {
            alert('总得说点什么吧');
            return;
        }

        $(this).addClass('circle')

        loadUserMsg(function(data) {

            data.user = user;
            userData = data;
            console.log(data);
            $(this).removeClass('circle');
            $('.edit').toHide().one(transitionend, function(){
                $(this).unbind(transitionend).hide();
                $('.preview').show().find('#prepre').text(data.text).end()
                    .find('#picture').attr('src', data.img).end()
                    .find('#i-temp').html(icons[data.w_icon]).end()
                    .find('#temp').text(data.weither).end()
                    .find('#time').text(data.time).end()
                    .find('#loc').text(data.location).end()
                    .find('.user span').text(data.user).end();
                    setTimeout(function(){
                        $('.preview').toShow();
                    })

            });

        }.bind(this))
    })

    $('.ret').click(function() {
        $('.preview').toHide().one(transitionend, function() {
            $(this).unbind(transitionend).hide();
            $('.edit').show()
            setTimeout(function(){
                $('.edit').toShow();
            })
        })
    })

    $('.go').click(function() {
        if(this.waiting) {
          return;
        }
        this.waiting = true;
        postData(this);
    })

    $('.mask').click(function() {
        alert('程序员大爷正在开发图片上传功能呢，敬请期待')
    })

    $('#picture').click(function() {
        userData.img = 'http://7xp0x5.com1.z0.glb.clouddn.com/photo'+Math.ceil(PICS * Math.random())+'.png'
        $(this).attr('src', userData.img);
    })
}

$(function() {

    FastClick.attach(document.body);

    init();
})

var test = function() {
    var arr = [];

    var str = 'http://openweathermap.org/img/w/50d.png';

}
