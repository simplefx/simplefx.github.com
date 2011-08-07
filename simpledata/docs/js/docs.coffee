user = 'simplefx'
repo = 'simplefx.github.com'
contentFolder = 'simpledata/docs/content'

showContentTree = (trees) ->
  for tree in trees
    $('#navigation').append("<li>#{tree.path}</li>")

getSubTree = (tree, subTreeNames) ->
  subTree = _.first(_.filter(tree, (item) -> item.path is _.first(subTreeNames)))
  if _.size(subTreeNames) is 1
    $.getJSON subTree.url + '?recursive=1&callback=?', (data) -> showContentTree data.data.tree
  else
    $.getJSON subTree.url + '?callback=?', (data) => getSubTree data.data.tree, _.rest(subTreeNames)

$ ->
  commitsUrl = "https://api.github.com/repos/#{user}/#{repo}/commits?callback=?"
  $.getJSON commitsUrl, (data) ->
    $.getJSON _.first(data.data).commit.tree.url + '?callback=?', (data) ->
      getSubTree data.data.tree, contentFolder.split('/')
