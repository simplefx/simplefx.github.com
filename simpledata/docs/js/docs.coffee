$ ->
  $.getJSON "https://api.github.com/repos/simplefx/simplefx.github.com/commits?callback=?", (data) ->
    for item in data.data
      $('#result').append('<li>' + item.commit.message + '</li>')
