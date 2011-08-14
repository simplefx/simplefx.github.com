(function() {
  var Node, Tree, contentFolder, getSubTree, repo, showContentTree, user;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  user = 'simplefx';
  repo = 'simplefx.github.com';
  contentFolder = 'simpledata/docs/content';
  Node = (function() {
    function Node(text) {
      this.text = text;
      this.nodes = [];
      this.index = false;
    }
    Node.prototype.addNode = function(parts) {
      var node;
      if (parts.length === 1) {
        if (parts[0] === 'index.html') {
          return this.index = true;
        } else {
          return this.nodes.push(new Node(parts[0]));
        }
      } else {
        node = _(this.nodes).detect(function(n) {
          return n.text === parts[0];
        });
        if (node != null) {
          return node.addNode(parts.slice(1));
        }
      }
    };
    Node.prototype.getItemHtml = function(path) {
      var html;
      html = '<li class="menu-item">';
      if (this.index) {
        html += this.indexLink(path);
      }
      if (this.nodes.length > 0) {
        html += this.getListHtml(path);
      } else {
        html += '<a href="' + path + this.text + '">' + this.getItemText() + '</a>';
      }
      return html += '</li>';
    };
    Node.prototype.getListHtml = function(path) {
      var html, node, _i, _len, _ref;
      html = '<ul class="menu">';
      path = path + this.text === '' ? '' : path + this.text + '/';
      _ref = this.nodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        html += node.getItemHtml(path);
      }
      return html += '</ul>';
    };
    Node.prototype.indexLink = function(path) {
      return '<a href="' + path + this.text + '/index.html">' + this.getItemText() + '</a>';
    };
    Node.prototype.getItemText = function() {
      return this.text.replace(/^[0-9]+ /, '').replace(/\.html$/, '');
    };
    return Node;
  })();
  Tree = (function() {
    __extends(Tree, Node);
    function Tree(trees) {
      var tree, _i, _len;
      this.nodes = [];
      this.text = '';
      for (_i = 0, _len = trees.length; _i < _len; _i++) {
        tree = trees[_i];
        this.addNode(tree.path.split('/'));
      }
    }
    return Tree;
  })();
  window.Tree = Tree;
  showContentTree = function(trees) {
    var tree;
    tree = new Tree(trees);
    return $('#nav').append(tree.getListHtml('content'));
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
