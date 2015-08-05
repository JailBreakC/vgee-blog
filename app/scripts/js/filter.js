define(['jquery', 'angular'], function($, angular) {
  var app, filterType;
  app = angular.module('myblog');
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
  return app.filter('blogListType', function() {
    var blogListType;
    return blogListType = filterType;
  });
});
