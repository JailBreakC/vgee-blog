requirejs.config({
  paths: {
    'angular': '../build/lib/angular-route-animate.min',
    'jquery': '../build/lib/jquery.min',
    'bootstrap': '../build/lib/bootstrap.min',
    'markdown': '../build/lib/markdown.min',
    'hljs': '../build/lib/highlight.pack'
  },
  shim: {
    'angular': {
      exports: 'angular'
    },
    'bootstrap': {
      deps: ['jquery'],
      exports: 'bootstrap'
    },
    'markdown': {
      exports: 'markdown'
    }
  }
});

requirejs(['jquery', 'angular', 'bootstrap'], function($, angular) {
  var app, debug, filterType, parseList, parsePost, parseTitle, parseType;
  debug = false;

  /*skel配置项
  skelparam = 
      containers: 1140
      breakpoints:
          medium: 
              media: '(min-width: 769px) and (max-width: 1200px)'
              containers: '90%'
          small:
              media: '(max-width: 768px)'
              containers: '95%'
      
  skel.init skelparam
   */
  angular.element(document).ready(function() {
    return setTimeout(function() {
      return angular.bootstrap(document, ['myblog']);
    });
  });
  app = angular.module('myblog', ['ui.router', 'ngAnimate']);
  app.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $stateProvider.state('main', {
        url: '/',
        templateUrl: '/template/page-main.html'
      }).state('cv', {
        url: '/cv',
        templateUrl: '/template/page-cv.html'
      }).state('contact', {
        url: '/contact',
        templateUrl: '/template/page-msg.html'
      }).state('project', {
        url: '/projects',
        templateUrl: '/template/page-project.html'
      }).state('blog', {
        url: '/blog',
        templateUrl: '/template/page-blog.html',
        controller: 'blog'
      }).state('blog.list', {
        url: '/:type',
        templateUrl: '/template/page-blog-list.html',
        controller: 'bloglist'
      }).state('blog.detail', {
        url: '/post/:article',
        templateUrl: '/template/page-blog-detail.html',
        controller: 'blogdetail'
      }).state('developing', {
        url: '/developing',
        templateUrl: '/template/page-developing.html'
      });
      if (debug) {
        return $urlRouterProvider.otherwise('/');
      } else {
        return $urlRouterProvider.otherwise('/developing');
      }
    }
  ]);
  app.factory('AuthService', [
    '$http', function($http) {
      var fn;
      fn = {};
      return {};
    }
  ]);
  filterType = function(data, param) {
    var i, j, len, output, type;
    if (param) {
      type = param;
    }
    if (type && data && type !== 'all') {
      output = [];
      for (j = 0, len = data.length; j < len; j++) {
        i = data[j];
        if (i.type === type) {
          output.push(i);
        }
      }
      return output;
    }
    return data;
  };
  app.filter('blogListType', function() {
    var blogListType;
    return blogListType = filterType;
  });
  app.directive('celAnimate', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'EA',
        link: function(scope, element, attrs) {
          var animationCheck, scrollCheck;
          $(element).addClass('cel-hide');
          scrollCheck = 0;
          animationCheck = function() {
            var height, pos, top;
            if ($(element).hasClass('cel-show')) {
              return;
            }
            height = $(window).height();
            top = $(window).scrollTop();
            pos = $(element).offset().top;
            if (pos - top <= height) {
              $(element).removeClass('cel-hide').addClass('cel-show');
            }
            return scrollCheck = 1;
          };
          animationCheck();
          $(window).scroll(function() {
            if (scrollCheck === 0) {
              return animationCheck();
            }
          });
          $rootScope.$on('$routeChangeSuccess', function() {
            return setTimeout(function() {
              return animationCheck();
            });
          });
          return setInterval(function() {
            return scrollCheck = 0;
          }, 200);
        }
      };
    }
  ]);
  app.directive('cover', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var cover;
        cover = function() {
          var eh, ew, wh, ww;
          element = $(element);
          ew = element.width();
          ww = $(window).width();
          eh = element.height();
          wh = $(window).height();
          element.css('min-width', wh * ew / eh + 'px');
          if (wh === eh) {
            return element.css('left', '-' + (ew - ww) / 2 + 'px');
          } else {
            return element.css('left', 0);
          }
        };
        cover();
        return window.onresize = function() {
          return cover();
        };
      }
    };
  });
  app.directive('changeFont', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var fonts, i, task;
        fonts = ['cursive', '-webkit-body', '-webkit-pictograph', 'fantasy', 'serif'];
        i = 0;
        task = {};
        return $(element).hover(function() {
          var that, title;
          that = this;
          title = $('.navbar-brand');
          return task.now = setInterval($.proxy(function() {
            $(title).css('font-family', fonts[i]);
            $(that).css('font-family', fonts[i]);
            if (++i >= 5) {
              return i = 0;
            }
          }), 200);
        }, function() {
          return clearInterval(task.now);
        });
      }
    };
  });
  app.directive('scrollFade', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var $ele, $window, eHeight, eTop;
        $ele = $(element);
        $window = $(window);
        eHeight = $ele.height();
        eTop = $ele.offset().top;
        return $window.scroll(function() {
          var opacity, size, wTop;
          wTop = $window.scrollTop();
          if (wTop > eTop && wTop - eTop <= eHeight) {
            size = (wTop - eTop) / (eHeight * 2) + 1;
            opacity = 1 - (wTop - eTop) / eHeight;
            console.log(size);
            console.log(opacity);
            console.log(eHeight);
            console.log(wTop);
            console.log(eTop);
            return $ele.css({
              'transform': 'scale(' + size + ')',
              'opacity': opacity
            });
          }
        });
      }
    };
  });
  app.directive('drag', function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var moveDrag;
        element = $(element);
        moveDrag = function() {
          var X, Y, start;
          start = 0;
          X = 0;
          Y = 0;
          return element.mousedown(function(event) {
            console.log(X);
            start = 1;
            X = event.clientX;
            Y = event.clientY;
            $('body').mousemove(function(eve) {
              var theX;
              console.log('start2' + start);
              if (start) {
                theX = eve.clientX - X;
                X = eve.clientX;
                element.parent().css('left', '+=' + theX + 'px');
                $('.bk-left').css('width', '+=' + theX + 'px');
                return $('.bk-right').css('left', '+=' + theX + 'px');
              }
            });
            return $('body').mouseup(function() {
              if (start === 1) {
                start = 0;
                $('body').unbind('mousemove');
                return $('body').unbind('mouseup');
              }
            });
          });
        };
        return moveDrag();
      }
    };
  });
  app.directive('showDetail', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var $target;
        $target = $('.bk-' + attrs.showDetail);
        return $(element).hover(function() {
          if ($(window).width() > 768) {
            $target.addClass('active');
            return $('.round').not($(this)).addClass('fadeout');
          }
        }, function() {
          if ($(window).width() > 768) {
            $target.removeClass('active');
            return $('.round').not($(this)).removeClass('fadeout');
          }
        });
      }
    };
  });
  app.directive('vgGo', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        return $(element).click(function() {
          return window.location.href = attrs.vgGo;
        });
      }
    };
  });
  app.directive('markdown', function() {
    return {
      restrict: 'A',
      scope: {
        content: '=markdownText'
      },
      link: function(scope, element, attrs) {
        var cssUrl, link, loading, them;
        them = attrs.theme ? attrs.theme : 'zenburn';
        cssUrl = require.toUrl('/style/lib/hightlight/' + them + '.css');
        link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
        loading = '<div class="spinner"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div>';
        return requirejs(['markdown', 'hljs'], function(md, hljs) {
          scope.$watch(function() {
            return scope.content;
          }, function(newValue) {
            if (newValue) {
              element.html(md.toHTML(newValue));
              return $(element).find('pre>code').each(function(i, block) {
                return hljs.highlightBlock(block);
              });
            } else {
              return element.html(loading);
            }
          });
          element.html(md.toHTML(scope.content));
          return $(element).find('pre>code').each(function(i, block) {
            return hljs.highlightBlock(block);
          });
        });
      }
    };
  });
  parseTitle = function(data) {
    var j, key, len, line, month, r, ref, ref1, value;
    r = {
      title: '',
      type: '',
      tag: '',
      disc: '',
      url: '',
      hide: ''
    };
    month = '零 一 二 三 四 五 六 七 八 九 十 十一 十二'.split(' ');
    ref = data.split('\n');
    for (j = 0, len = ref.length; j < len; j++) {
      line = ref[j];
      ref1 = line.split(':'), key = ref1[0], value = ref1[1];
      key = $.trim(key);
      value = $.trim(value);
      if (r.hasOwnProperty(key)) {
        r[key] = value;
      }
    }
    r.date = r.url.split('-');
    r.date.month = month[parseInt(r.date[1], 10)];
    r.date.day = parseInt(r.date[2], 10);
    return r;
  };
  parseList = function(data) {
    var r;
    r = [];
    data = data.split(/\n[\-=]+/);
    data.forEach(function(list) {
      list = parseTitle(list);
      if (list.hide !== 'true') {
        return r.push(list);
      }
    });
    return r;
  };
  parseType = function(data) {
    var r;
    r = [];
    data.forEach(function(list) {
      if (r.indexOf(list.type) === -1) {
        return r.push(list.type);
      }
    });
    return r;
  };
  parsePost = function(text) {
    var flag, head, j, len, line, post, ref, tail;
    flag = false;
    head = '';
    tail = '';
    ref = text.split('\n');
    for (j = 0, len = ref.length; j < len; j++) {
      line = ref[j];
      if (/[\-=]+/.test(line)) {
        flag = true;
      }
      if (flag) {
        tail += '\n' + line;
      } else {
        head += '\n' + line + '\n';
      }
    }
    post = parseTitle(head);
    post.text = tail;
    if (post.hide === 'true') {
      return;
    }
    return post;
  };
  app.controller('blog', [
    '$scope', '$http', '$rootScope', '$timeout', '$location', '$stateParams', function($scope, $http, $rootScope, $timeout, $location, $stateParams) {
      $http.get('/post/list.md').success(function(data) {
        $scope.blogList = $scope.blogListOrigin = parseList(data);
        return $scope.listType = parseType($scope.blogList);
      });
      $scope.changethemes = function(index) {
        var enterEle, leaveEle;
        $scope.themes.forEach(function(v) {
          return v.selected = false;
        });
        $scope.themes[index].selected = true;
        $scope.themeclass = 'theme-' + $scope.themes[index].color;
        enterEle = '<div class="header-background bg-enter" style="background: url(/img/0' + (index + 1) + '.jpg) no-repeat;background-size: cover;"></div>';
        leaveEle = $('.c-blog > .header').find('.header-background');
        leaveEle.removeClass('bg-enter').addClass('bg-leave');
        setTimeout(function() {
          return leaveEle.remove();
        }, 1000);
        return $(enterEle).appendTo('.c-blog > .header');
      };
      return $scope.themes = [
        {
          color: 'green',
          selected: true
        }, {
          color: 'blue',
          selected: false
        }, {
          color: 'purple',
          selected: false
        }, {
          color: 'yellow',
          selected: false
        }, {
          color: 'pink',
          selected: false
        }
      ];
    }
  ]);
  app.controller('bloglist', [
    '$scope', '$rootScope', '$http', '$stateParams', function($rootScope, $scope, $http, $stateParams) {
      return console.log($scope.blogtype = $rootScope.$parent.$parent.blogtype = $stateParams.type);
    }
  ]);
  return app.controller('blogdetail', [
    '$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
      return $http.get('/post/' + $stateParams.article).success(function(data) {
        data = parsePost(data);
        $scope.title = data.title;
        return $scope.article = data.text;
      });
    }
  ]);
});
