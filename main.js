var http = require('http')
var fs = require('fs')
var url = require('url')
var qs = require('querystring')
var template = require('./lib/template.js')
var path = require('path')
var sanitizeHtml = require('sanitize-html')

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
                var list = template.list(filelist);
                var html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`)
                res.writeHead(200);
                res.end(html);
            })
        }
        else {
            fs.readdir('./data', function(error, filelist) {
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
                    var title = queryData.id
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizedDescription = sanitizeHtml(description, {
                        allowedTags: ['h1']
                    });
                    var list = template.list(filelist)
                    var html = template.html(sanitizedTitle, list, 
                        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, 
                        `<a href="/create">create</a> <a href="/update?id=${title}">update</a> 
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizedTitle}" />
                            <input type="submit" value="delete" />
                        </form>`
                    );
                    res.writeHead(200);
                    res.end(html);
                })
            })
            
        }
        
    } else if(pathname === '/create') {
        fs.readdir('./data', function(err, filelist) {
            var title = 'WEB - create'
            var list = template.list(filelist);
            var html = template.html(title, list, `
                <form action="http://localhost:3000/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"/></p>
                    <p><textarea name="description" placeholder="description"></textarea></p>
                    <p><input type="submit" /></p>
                </form>
            `, '');
            res.writeHead(200);
            res.end(html);
        })
    } else if(pathname=='/create_process') {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body)
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                res.writeHead(302, {Location: `/?id=${title}`});
                res.end();
            })
        })
    } else if(pathname == '/update') {
        fs.readdir('./data', function(error, filelist) {
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
                var title = queryData.id
                var list = template.list(filelist)
                var html = template.html(title, list, 
                    `
                    <form action="http://localhost:3000/update_process" method="post">
                        <input type="hidden" value="${title}" name="id" /> 
                        <p><input type="text" name="title" value="${title}"/></p>
                        <p><textarea name="description">${description}</textarea></p>
                        <p><input type="submit" /></p>
                    </form>
                    `, 
                    ``
                );
                res.writeHead(200);
                res.end(html);
            })
        })
    } else if(pathname=='/update_process') {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body)
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(err) {
                fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                    res.writeHead(302, {Location: `/?id=${title}`});
                    res.end();
                })
            })
        })
    } else if(pathname == '/delete_process') {
        var body = '';
        req.on('data', function(data) {
            body = body + data;
        });
        req.on('end', function() {
            var post = qs.parse(body)
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(err) {
                res.writeHead(302, {Location: `/`});
                res.end();
            })
        })
    }
    else {
        res.writeHead(404);
        res.end('Not found');
    }
    
    
})

app.listen(3000);