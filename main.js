var http = require('http')
var fs = require('fs')
var url = require('url')

var app = http.createServer(function(req, res) {
    var _url = req.url
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    
    if(pathname == '/') {
        if(queryData.id == undefined) {

            fs.readdir('./data', function(err, filelist) {
                console.log(filelist)
                var title = 'welcome'
                var description = 'Hello, Node.js'
                var list = '<ul>'
                var i = 0;
                while(i < filelist.length) {
                    list = list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
                    i = i + 1
                }
                list = list + '</ul>'
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
                ${list}
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html>
                `;
                res.writeHead(200);
                res.end(template);
            })
        }
        else {
            fs.readdir('./data', function(error, filelist) {
                var title = 'welcome'
                var description = 'Hello, Node.js'
                var list = '<ul>'
                var i = 0;
                while(i < filelist.length) {
                    list = list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
                    i = i + 1
                }
                list = list + '</ul>'
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, data) {
                    var title = queryData.id
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
                    ${list}
                    <h2>${title}</h2>
                    <p>
                        ${description}
                    </p>
                    </body>
                    </html>
                    `
                    res.writeHead(200);
                    res.end(template);
                })
            })
            
        }
        
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
    
    
})

app.listen(3000);