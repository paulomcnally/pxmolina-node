var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var http = require('http');

var url = 'http://www.confidencial.com.ni/pxmolina';
var image_url_format = 'http://www.confidencial.com.ni/%s';

http.createServer(function (req, res) {


  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    return;
  }

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      $ = cheerio.load(body);

      var src = $("#left img").eq(0).attr("src");

      var image_url = util.format( image_url_format, src );

      res.writeHead(200, {'Content-Type': 'text/plain'} );
      res.write(image_url);
      res.end();

    }
  });

}).listen(process.env.PORT || 5000);
