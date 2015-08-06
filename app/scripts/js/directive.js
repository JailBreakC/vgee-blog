define(['jquery', 'angular'], function($, angular) {
  var app;
  app = angular.module('myblog');
  app.directive('celAnimate', [
    '$rootScope', function($rootScope) {
      return {
        restrict: 'EA',
        link: function(scope, element, attrs) {
          var animationCheck, scrollCheck;
          if ($(window).width() < 768) {
            return;
          }
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
        if ($(window).width() < 768) {
          return;
        }
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
        cssUrl = require.toUrl('/app/assets/css/lib/highlight/' + them + '.css');
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
      link: function(scope, element, attr) {
        if (!localStorage.getItem('theme')) {
          return localStorage.setItem('theme', 'green');
        }
      },
      controller: [
        '$scope', '$rootScope', '$timeout', '$http', function($scope, $rootScope, $timeout, $http) {
          var imgs, picsize, themes;
          themes = [];
          picsize = '1080x1800';
          if ($(window).width() < 500) {
            picsize = '500x500xz';
          }
          imgs = {
            'green': 'http://gtms01.alicdn.com/tps/i1/TB1I3coIFXXXXaOXpXXxjZKVXXX-1200-675.jpg_' + picsize + '.jpg',
            'pink': 'http://gtms03.alicdn.com/tps/i3/TB1CUj9IFXXXXbNaXXX9l.7UFXX-1920-1080.jpg_' + picsize + '.jpg',
            'purple': 'http://gtms04.alicdn.com/tps/i4/TB1euAmIFXXXXbnXpXX9l.7UFXX-1920-1080.jpg_' + picsize + '.jpg',
            'blue': 'http://gtms01.alicdn.com/tps/i1/TB1jEEuIFXXXXXrXXXX9l.7UFXX-1920-1080.jpg_' + picsize + '.jpg',
            'yellow': 'http://gtms03.alicdn.com/tps/i3/TB1e4EaIFXXXXcuXVXX9l.7UFXX-1920-1080.jpg_' + picsize + '.jpg'
          };
          this.gotChanged = function(theme) {
            var changeTheme, xhr;
            changeTheme = function() {
              var background, enterEle, leaveEle;
              themes.forEach(function(v) {
                if (v !== theme) {
                  return v.selected = false;
                }
              });
              $scope.themes.themeClass = 'theme-' + theme.color;
              localStorage.setItem('theme', theme.color);
              theme.loaded = true;
              background = 'url(' + theme.url + ')';
              enterEle = $('.header-background.bg-leave');
              leaveEle = $('.header-background.bg-enter');
              leaveEle.removeClass('bg-enter').addClass('bg-leave');
              enterEle.removeClass('bg-leave').addClass('bg-enter').css('background-image', background);
              return $rootScope.$broadcast('themeChangeSuccess');
            };
            if (theme.loaded) {
              changeTheme();
              return;
            }
            theme.img = new Image();
            if (window.URL.createObjectURL) {
              $rootScope.$broadcast('themeChangeStart', {
                'fake': false
              });
              xhr = new XMLHttpRequest();
              xhr.open('GET', imgs[theme.color]);
              xhr.responseType = 'blob';
              xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                  return theme.url = window.URL.createObjectURL(xhr.response);
                }
              };
              xhr.onprogress = function(e) {
                return $rootScope.$apply(function() {
                  return $rootScope.$broadcast('themeChangeProgress', e);
                });
              };
              xhr.send();
            } else {
              $rootScope.$broadcast('themeChangeStart', {
                'fake': true
              });
              theme.img.src = theme.url = imgs[theme.color];
            }
            return xhr.onload = theme.img.onload = changeTheme;
          };
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
          var nowtheme;
          scope.theme.selected = false;
          nowtheme = localStorage.getItem('theme');
          themeSwitcherController.addThemes(scope.theme);
          scope.toggleTheme = function() {
            scope.theme.selected = true;
            return themeSwitcherController.gotChanged(scope.theme);
          };
          if (nowtheme === scope.theme.color) {
            return scope.toggleTheme();
          }
        }
      };
    }
  ]);
  return app.directive('progressTool', [
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
});
