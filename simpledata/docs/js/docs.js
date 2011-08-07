(function() {
  var contentFolder, getSubTree, repo, showContentTree, user;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  user = 'simplefx';
  repo = 'simplefx.github.com';
  contentFolder = 'simpledata/docs/content';
  showContentTree = function(trees) {
    var tree, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = trees.length; _i < _len; _i++) {
      tree = trees[_i];
      _results.push($('#navigation').append("<li>" + tree.path + "</li>"));
    }
    return _results;
  };
  getSubTree = function(tree, subTreeNames) {
    var subTree;
    subTree = _.first(_.filter(tree, function(item) {
      return item.path === _.first(subTreeNames);
    }));
    if (_.size(subTreeNames) === 1) {
      return $.getJSON(subTree.url + '?recursive=1&callback=?', function(data) {
        return showContentTree(data.data.tree);
      });
    } else {
      return $.getJSON(subTree.url + '?callback=?', __bind(function(data) {
        return getSubTree(data.data.tree, _.rest(subTreeNames));
      }, this));
    }
  };
  $(function() {
    var commitsUrl;
    commitsUrl = "https://api.github.com/repos/" + user + "/" + repo + "/commits?callback=?";
    return $.getJSON(commitsUrl, function(data) {
      return $.getJSON(_.first(data.data).commit.tree.url + '?callback=?', function(data) {
        return getSubTree(data.data.tree, contentFolder.split('/'));
      });
    });
  });
}).call(this);
