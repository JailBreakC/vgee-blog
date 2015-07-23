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
  angular.element(document).ready(function() {
    return setTimeout(function() {
      return angular.bootstrap(document, ['myblog']);
    });
  });
  app = angular.module('myblog', ['ui.router', 'ngAnimate']);
  app.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $stateProvider.state('index', {
        url: '',
        templateUrl: '/template/page-main.html'
      }).state('main', {
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
            return scrollCheck = 0;
          });
          $rootScope.$on('$routeChangeSuccess', function() {
            return setTimeout(function() {
              return animationCheck();
            });
          });
          return setInterval(function() {
            if (scrollCheck === 0) {
              return animationCheck();
            }
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
          if (wTop > eTop && wTop - eTop <= eHeight * 2) {
            size = (wTop - eTop) / (eHeight * 2) + 1;
            opacity = 1 - (wTop - eTop) / (eHeight * 2);
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
        element.html(loading);
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
          if (scope.content) {
            element.html(md.toHTML(scope.content));
            return $(element).find('pre>code').each(function(i, block) {
              return hljs.highlightBlock(block);
            });
          } else {
            return element.html(loading);
          }
        });
      }
    };
  });
  app.directive('themeSwitcher', function() {
    return {
      restrict: 'E',
      scope: {
        themes: '=themes'
      },
      controller: [
        '$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout) {
          var imgs, themes;
          themes = [];
          imgs = {
            'green': 'http://gtms01.alicdn.com/tps/i1/TB1I3coIFXXXXaOXpXXxjZKVXXX-1200-675.jpg_1080x1800.jpg',
            'pink': 'http://gtms03.alicdn.com/tps/i3/TB1CUj9IFXXXXbNaXXX9l.7UFXX-1920-1080.jpg_1080x1800.jpg',
            'purple': 'http://gtms04.alicdn.com/tps/i4/TB1euAmIFXXXXbnXpXX9l.7UFXX-1920-1080.jpg_1080x1800.jpg',
            'blue': 'http://gtms01.alicdn.com/tps/i1/TB1jEEuIFXXXXXrXXXX9l.7UFXX-1920-1080.jpg_1080x1800.jpg',
            'yellow': 'http://gtms03.alicdn.com/tps/i3/TB1e4EaIFXXXXcuXVXX9l.7UFXX-1920-1080.jpg_1080x1800.jpg'
          };
          this.gotChanged = function(theme) {
            var bkimg;
            bkimg = new Image();
            bkimg.src = imgs[theme.color];
            return $(bkimg).load(function() {
              return $rootScope.$apply(function() {
                var background, enterEle, leaveEle;
                themes.forEach(function(v) {
                  if (v !== theme) {
                    return v.selected = false;
                  }
                });
                $scope.themes.themeClass = 'theme-' + theme.color;
                background = 'url(' + imgs[theme.color] + ')';
                enterEle = $('.header-background.bg-leave');
                leaveEle = $('.header-background.bg-enter');
                leaveEle.removeClass('bg-enter').addClass('bg-leave');
                enterEle.removeClass('bg-leave').addClass('bg-enter').css('background-image', background);
                return $rootScope.$broadcast('themeChangeSuccess');
              });
            });
          };
          $timeout(function() {
            return $rootScope.$broadcast('themeChangeSuccess');
          }, 300);
          this.addThemes = function(e) {
            return themes.push(e);
          };
        }
      ]
    };
  });
  app.directive('switcher', [
    '$rootScope', '$timeout', function($rootScope, $timeout) {
      return {
        restrict: 'EA',
        template: '<i ng-click="toggleTheme()" class="{{theme.selected ? \'active\' : \'\'}} glyphicon glyphicon-sunglasses"></i>',
        replace: true,
        transclude: true,
        require: '^themeSwitcher',
        scope: {
          theme: '=tm'
        },
        link: function(scope, element, attr, themeSwitcherController) {
          scope.theme.selected = false;
          $rootScope.$broadcast('themeChangeStart');
          if (scope.theme.color === 'green') {
            scope.theme.selected = true;
          }
          themeSwitcherController.addThemes(scope.theme);
          return scope.toggleTheme = function() {
            scope.theme.selected = true;
            themeSwitcherController.gotChanged(scope.theme);
            return $rootScope.$broadcast('themeChangeStart');
          };
        }
      };
    }
  ]);
  app.directive('progressTool', [
    '$rootScope', '$timeout', function($rootScope, $timeout) {
      return {
        restrict: 'EA',
        replace: true,
        template: '<div class="progress {{mhide}}"> <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="{{percent}}" aria-valuemin="0" aria-valuemax="100" style="width: {{percent}}%;"> <span class="{{showPercent ? \'\' : \'sr-only\'}}">{{percent}}%</span> </div> </div>',
        scope: {
          percent: '=percent',
          showPercent: '=showPercent'
        },
        link: function(scope, element, attrs) {
          scope.mhide = '';
          scope.percent += '';
          return scope.$watch(function() {
            return scope.percent;
          }, function() {
            if (scope.percent === '100') {
              $timeout(function() {
                scope.percent = '0';
                return scope.mhide = 'hide';
              }, 500);
              return $timeout(function() {
                return scope.mhide = '';
              }, 800);
            }
          });
        }
      };
    }
  ]);
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
      (function(a, b, c) {});
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
  app.controller('blog', [
    '$scope', '$http', '$rootScope', '$timeout', '$location', '$stateParams', function($scope, $http, $rootScope, $timeout, $location, $stateParams) {
      $http.get('/post/list.md').success(function(data) {
        $scope.blogList = $scope.blogListOrigin = parseList(data);
        return $scope.listType = parseType($scope.blogList);
      });
      $scope.percent = '0';
      $rootScope.$on('themeChangeStart', function() {
        return $scope.percent = '30';
      });
      $rootScope.$on('themeChangeSuccess', function() {
        return $scope.percent = '100';
      });
      $scope.themes = [
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
      return $scope.themes.themeClass = 'theme-green';
    }
  ]);
  app.controller('bloglist', [
    '$rootScope', '$scope', '$http', '$stateParams', function($rootScope, $scope, $http, $stateParams) {
      return $scope.blogtype = $rootScope.blogtype = $stateParams.type;
    }
  ]);
  return app.controller('blogdetail', [
    '$scope', '$http', '$stateParams', '$timeout', '$location', function($scope, $http, $stateParams, $timeout, $location) {
      var toggleDuoshuoComments;
      $http.get('/post/' + $stateParams.article).success(function(data) {
        data = parsePost(data);
        $scope.title = data.title;
        $scope.article = data.text;
        return toggleDuoshuoComments('.blog-detail');
      });
      return toggleDuoshuoComments = function(container) {
        var el;
        el = document.createElement('div');
        el.setAttribute('id', $location.url());
        el.setAttribute('data-thread-key', $scope.title);
        el.setAttribute('data-url', $location.url());
        DUOSHUO.EmbedThread(el);
        return jQuery(container).append(el);
      };
    }
  ]);
});
