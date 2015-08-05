define(['jquery', 'angular'], function($, angular) {
  var app, filterType, parseList, parsePost, parseTitle, parseType;
  app = angular.module('myblog');
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
  app.controller('blog', [
    '$scope', '$http', '$rootScope', '$timeout', '$location', '$stateParams', function($scope, $http, $rootScope, $timeout, $location, $stateParams) {
      $http.get('/post/list.md').success(function(data) {
        $scope.blogList = $scope.blogListOrigin = parseList(data);
        return $scope.listType = parseType($scope.blogList);
      });
      $scope.percent = '0';
      $rootScope.$on('themeChangeStart', function(e, data) {
        if (data.fake) {
          return $scope.percent = '30';
        } else {
          return $scope.percent = '0';
        }
      });
      $rootScope.$on('themeChangeSuccess', function() {
        return $scope.percent = '100';
      });
      $rootScope.$on('themeChangeProgress', function(e, data) {
        $scope.percent = (data.loaded / data.total) * 100 + '';
        return console.log($scope.percent);
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
