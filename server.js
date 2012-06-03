/*jslint node: true, indent: 2, sloppy: true, white: true, vars: true */

var express = require('express');
var fs = require('fs');
var rs = require('robotskirt');

var app = express.createServer(express.logger());

express.bodyParser.parse['text/plain'] = function (req, options, callback) {
  var buf = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){ buf += chunk; });
  req.on('end', function(){
    try {
      if (!buf.length) {
        req.body = '';
      } else {
        req.body = buf;
      }
      callback();
    } catch (err) {
      callback(err);
    }
  });
};

app.configure(function () {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  app.use(express.bodyParser());
});

var htmlRenderer = new rs.HtmlRenderer();
app.post('/api/render', function (req, response) {
  var flags = ~0;

  rs.markdown(htmlRenderer, req.body, function (html) {
    response.header('Content-Type', 'text/html');
    response.send(html);
  }, flags);
});


/*
 * Static files
 */

function sendFile(response, filename, type) {
  fs.readFile(filename, function (err, data) {
    if (err) {
      console.log(err.message);
      if (err.code === 'ENOENT') {
        response.send(404);
      } else {
        response.send(500);
      }
      return;
    }
    response.header('Content-Type', type);
    response.send(data);
  });
}

app.get(/(.*)/, function (req, response) {
  var path = req.params[0];

  if (path[path.length - 1] === '/') {
    path = path + 'index.html';
  }

  if (path[0] === '/') {
    path = '.' + path;
  }

  var index = path.lastIndexOf('.');
  var format = '';
  if (index > -1) {
    format = path.substring(index);
  }

  var type;
  switch (format) {
  case '.html':
    type = 'text/html';
    break;
  case '.css':
    type = 'text/css';
    break;
  case '.js':
    type = 'application/javascript';
    break;
  case '.gif':
    type = 'image/gif';
    break;
  case '.png':
    type = 'image/png';
    break;
  default:
    type = 'text/html';
  }

  sendFile(response, path, type);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});
