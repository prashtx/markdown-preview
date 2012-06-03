/*jslint browser: true, indent: 2, sloppy: true, white: true, vars: true */
/*globals jQuery */

(function ($) {
  function updateResult(data) {
    $('#result').html(data);
  }

  function updateSource(data) {
    $('#html_result').val(data
                          .replace(/>/g, '>\n')
                          .replace(/</g, '\n<')
                          .replace(/\n{2,}/g, '\n\n'));
  }

  // Asynchronous. Hit the server to convert Markdown to HTML.
  function convertMarkdown(mdText) {
    // Send the Markdown text to the server.
    $.ajax({
      url: '/api/render',
      dataType: 'html',
      type: 'POST',
      contentType: 'text/plain',
      data: mdText
    })
    .done(function (data) {
      updateResult(data);
      updateSource(data);
    });
  }

  $(document).ready(function () {
    var keyTimeout = null;
    $('#user_input').keyup(function () {
      if (keyTimeout !== null) {
        clearTimeout(keyTimeout);
      }
      keyTimeout = setTimeout(function () {
        keyTimeout = null;
        convertMarkdown($('#user_input').val());
      }, 1000);
    });

    // Default text
    var sample = '#### Underscores\nthis should have _emphasis_\nthis_should_not\n_nor_should_this\n\n' +
                 '#### Autolinking\na non-markdown link: http://github.com/blog\nthis one is [a markdown link](http://github.com/blog)\nEmail test: support@github.com\n\n' + 
                 '#### Commit links\nc4149e7bac80fcd1295060125670e78d3f15bf2e\ntekkub@c4149e7bac80fcd1295060125670e78d3f15bf2e\nmojombo/god@c4149e7bac80fcd1295060125670e78d3f15bf2e\n\n' +
                 '#### Issue links\nissue #1\ntekkub#1\nmojombo/god#1';
    $('#user_input').text(sample);
    convertMarkdown($('#user_input').val());
  });
}(jQuery));

