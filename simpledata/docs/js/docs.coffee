user = 'simplefx'
repo = 'simplefx.github.com'
contentFolder = 'simpledata/docs/content'

class Node
  constructor: (@text) ->
    @nodes = []
    @index = false
  addNode: (parts) ->
    if parts.length is 1
      if parts[0] is 'index.html'
        @index = true
      else
        @nodes.push new Node parts[0]
    else
      node = _(@nodes).detect((n) -> n.text is parts[0])
      node.addNode parts.slice(1) if node?
  getItemHtml: (path) ->
    html = '<li class="menu-item">'
    if @index
      html += @indexLink(path)
    if @nodes.length > 0
      html += @getListHtml(path)
    else
      html += '<a href="' + path + @text + '">' + @getItemText() + '</a>'
    html += '</li>'
  getListHtml: (path) ->
    html = '<ul class="menu">'
    path = if path + @text is '' then '' else path + @text + '/'
    for node in @nodes
      html += node.getItemHtml(path)
    html += '</ul>'
  indexLink: (path) ->
    '<a href="' + path + @text + '/index.html">' + @getItemText() + '</a>'
  getItemText: ->
    @text.replace(/^[0-9]+ /,'').replace(/\.html$/, '')

class Tree extends Node
  constructor: (trees) ->
    @nodes = []
    @text = ''
    for tree in trees
      @addNode tree.path.split('/')

window.Tree = Tree

showContentTree = (trees) ->
  tree = new Tree trees
  $('#nav').append tree.getListHtml('content')

getSubTree = (tree, subTreeNames) ->
  subTree = _.first(_.filter(tree, (item) -> item.path is _.first(subTreeNames)))
  if _.size(subTreeNames) is 1
    $.getJSON subTree.url + '?recursive=1&callback=?', (data) -> showContentTree data.data.tree
  else
    $.getJSON subTree.url + '?callback=?', (data) -> getSubTree data.data.tree, _.rest(subTreeNames)

$ ->
  commitsUrl = "https://api.github.com/repos/#{user}/#{repo}/commits?callback=?"
  $.getJSON commitsUrl, (data) ->
    $.getJSON _.first(data.data).commit.tree.url + '?callback=?', (data) ->
      getSubTree data.data.tree, contentFolder.split('/')
  $('a').live 'click', ->
    if ($(this).attr('href').match /^content/i)?
      url = encodeURIComponent($(this).attr('href'))
      $('#main').load url
      return false
    true
    