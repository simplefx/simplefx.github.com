(function() {
  var addNestedNode, contentFolder, getSubTree, repo, showContentTree, toDashes, user;
  user = 'simplefx';
  repo = 'simplefx.github.com';
  contentFolder = 'simpledata/docs/content';
  toDashes = function(str) {
    return str.replace(/[\s\.\/]/g, '-');
  };
  addNestedNode = function(tree) {
    var id, parts, selector, subList;
    parts = tree.path.split('/');
    id = toDashes(tree.path);
    selector = '#' + _.map(parts.slice(0, -1), toDashes).join('-');
    subList = tree.type === 'tree' ? '<ul></ul>' : '';
    return $(selector + ' > ul').append("<li id=\"" + id + "\">" + (_.last(parts)) + subList + "</li>");
  };
  showContentTree = function(trees) {
    var tree, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = trees.length; _i < _len; _i++) {
      tree = trees[_i];
      _results.push(tree.path.indexOf('/') === -1 ? $('#navigation').append("<li id=\"" + (toDashes(tree.path)) + "\">" + tree.path + "<ul></ul></li>") : addNestedNode(tree));
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
      return $.getJSON(subTree.url + '?callback=?', function(data) {
        return getSubTree(data.data.tree, _.rest(subTreeNames));
      });
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
