//////////////////////////////////////////
//
// HTTPサーバーに関するJS.
//
//////////////////////////////////////////

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var logic = require('./boardLogic');


////////////////////////////////////////////////////////
//  
//  ファイルコンテンツの種類によりレスポンスを返す.
//  from http://d.hatena.ne.jp/Jxck/20101022/1287765155
//  
////////////////////////////////////////////////////////
var load_static_file = function(uri, response) {

    var tmp = uri.split('.');
    var type = tmp[tmp.length - 1];
    var filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('404 Not Found\n');
            response.end();
            return;
        }

        fs.readFile(filename, 'binary', function(err, file) {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write(err + '\n');
                response.end();
                return;
            }

            switch (type) {
            case 'html':
                response.writeHead(200, {'Content-Type': 'text/html'});
                break;
            case 'js':
                response.writeHead(200, {'Content-Type': 'text/javascript'});
                break;
            case 'css':
                response.writeHead(200, {'Content-Type': 'text/css'});
                break;
            case 'png':
                response.writeHead(200, {'Content-Type': 'image/png'});
                break;
            }
            response.write(file, 'binary');
            response.end();
        });
    });
};


/**
 * HTTPサーバーの作成とURLルーティング.
 */
exports.Server = http.createServer(
    function(req, res) {
	var uri = url.parse(req.url).pathname;
        console.log('req.url=' + req.url);
	
        switch (uri) { 
        case '/init':
	    //現在のpostitデータを返す.
	    res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(logic.findAll());
	    break;
        default:
	    //それ以外は静的ファイルを普通に読み込み
	    load_static_file(uri, res);    
	}
	
    });