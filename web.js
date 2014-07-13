var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var http = require('http');
var memjs = require('memjs');

var url = 'http://www.confidencial.com.ni/pxmolina';
var image_url_format = 'http://www.confidencial.com.ni/%s';
var expire = 3600; // 1 hout

http.createServer(function (req, res) {

  // Ignore favicon
  if (req.url === '/favicon.ico') {

    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    return;

  }

  // Create head
  res.writeHead(200, {'Content-Type': 'text/plain'} );

  // Create memcached client
  var mc = memjs.Client.create();

  // Consult memcached data
  mc.get('data', function(err, value, key) {
    if( value === null ){
      // Make request
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          $ = cheerio.load(body);
          var src = $("#left img").eq(0).attr("src");
          var image_url = util.format( image_url_format, src );
          // save data on memcached
          mc.set('data', image_url, function(err, success) {
          },expire);
          // output request data
          console.log('from request');
          res.write(image_url);
          res.end();
        }
      });
    }
    else{
      // output memcached data
      console.log('from memcached');
      res.write(value);
      res.end();
    }
  });
}).listen(process.env.PORT || 5000);
