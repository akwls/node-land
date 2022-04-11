var http = require('http')
var fs = require('fs')
var url = require('url')

var app = http.createServer(function(req, res) {
    var _url = req.url
    var queryData = url.parse(_url, true).query;
    var title = queryData.id
    console.log(queryData.id);
    if(_url == '/') {
        title="Welcome"
    }
    if(_url == '/favicon.ico') {
        return res.writeHead(404)
    }
    res.writeHead(200)
    fs.readFile(`data/${queryData.id}.txt`, 'utf8', function(err, data) {
        var description = data
        var template = 
        `
        <!doctype html>
        <html>
        <head>
        <meta charset="utf-8">
        <title>WEB1 - ${title}</title>
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
    
        <h2>${title}</h2>
        <p>
            ${description}
        </p>
        </body>
        </html>
        `
        res.end(template);
    })
    
})

app.listen(3000);