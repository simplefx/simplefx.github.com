user = 'simplefx'
repo = 'simplefx.github.com'
commitsUrl = "https://api.github.com/repos/#{user}/#{repo}/commits?callback=?"
$ ->
  $.getJSON commitsUrl, (data) ->
    rootTree = _.first(data.data).commit.tree
    $.getJSON rootTree.url + '?callback=?', (data) ->
      simpledataTree = _.first(_.filter(data.data.tree, (item) -> item.path is 'simpledata'))
      $.getJSON simpledataTree.url + '?callback=?', (data) ->
        docsTree = _.first(_.filter(data.data.tree, (item) -> item.path is 'docs'))
        $.getJSON docsTree.url + '?callback=?', (data) ->
          contentTree = _.first(_.filter(data.data.tree, (item) -> item.path is 'content'))
          $.getJSON contentTree.url + '?recursive=1&callback=?', (data) ->
            for tree in data.data.tree
              $('#navigation').append("<li>#{tree.path}</li>")