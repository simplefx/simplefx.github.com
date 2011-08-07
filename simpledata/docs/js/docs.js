(function() {
  var commitsUrl, repo, user;
  user = 'simplefx';
  repo = 'simplefx.github.com';
  commitsUrl = "https://api.github.com/repos/" + user + "/" + repo + "/commits?callback=?";
  $(function() {
    return $.getJSON(commitsUrl, function(data) {
      var rootTree;
      rootTree = _.first(data.data).commit.tree;
      return $.getJSON(rootTree.url + '?callback=?', function(data) {
        var simpledataTree;
        simpledataTree = _.first(_.filter(data.data.tree, function(item) {
          return item.path === 'simpledata';
        }));
        return $.getJSON(simpledataTree.url + '?callback=?', function(data) {
          var docsTree;
          docsTree = _.first(_.filter(data.data.tree, function(item) {
            return item.path === 'docs';
          }));
          return $.getJSON(docsTree.url + '?callback=?', function(data) {
            var contentTree;
            contentTree = _.first(_.filter(data.data.tree, function(item) {
              return item.path === 'content';
            }));
            return $.getJSON(contentTree.url + '?recursive=1&callback=?', function(data) {
              var tree, _i, _len, _ref, _results;
              _ref = data.data.tree;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                tree = _ref[_i];
                _results.push($('#navigation').append("<li>" + tree.path + "</li>"));
              }
              return _results;
            });
          });
        });
      });
    });
  });
}).call(this);
