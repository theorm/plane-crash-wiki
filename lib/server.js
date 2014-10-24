var express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , fs = require('fs')
  , articleFilename = 'article.html'
  , Article = require('./article');




module.exports = {

  newApplication: function() {

    var articleCache
      , articleRevision;

    app.use(bodyParser.text());

    function fibonacci(n) {
      if (n < 2)
        return 1;
      else
        return fibonacci(n-2) + fibonacci(n-1);
    }

    function readFile(cb) {
      Article.read(articleFilename, function(err, text) {
        if (err) {
          if (cb) cb(err);
        } else {
          Article.getRevision(text, function(err, revision) {
            if (err) {
              if (cb) cb(err);
            } else {
              articleCache = text;
              articleRevision = revision;
              if(cb) cb(null, articleRevision);
            }
          })
        }
      })
    }


    function createFileIfNeeded(cb) {
      Article.checkExists(articleFilename, function(err, exists) {
        if (!exists) {
          Article.save(articleFilename, 'Plane crash', cb);
        } else {
          if (cb) cb();
        }
      });
    }


    app.get('/', function(req, res) {
      if (articleCache === undefined) {
        res.status(500).send('No file loaded');
      } else {
        fibonacci(34);
        res.set('Content-Type', 'text/html');
        res.setHeader('article-revision', articleRevision);
        res.send(articleCache);
      }
    });

    app.put('/', function(req, res) {
      if (articleCache === undefined) {
        res.status(500).send('No file loaded');
      } else {

        var revision = req.headers['article-revision'];
        
        if (!revision) {
          res.status(409).send('"article-revision" header is missing.');
        } else {
          if (articleRevision !== revision) {
            res.status(409).send('Article has been updated since this revision.');
          } else {
            Article.save(articleFilename, req.body, function(err) {
              if (err) {
                res.status(500).send('Could not save article: ' + err);
              } else {
                res.send('Aricle updated');
              }
            }); 
          }
        }
      }
    });

    app.monitorFile = function(cb) {

      createFileIfNeeded(function(err) {
          if (err) {
            process.exit(-1);
          } else {
            readFile(function(err) {
              if (err) {
                process.exit(-1);
              } else {
                fs.watch(articleFilename, function(event, filename) {
                  if (event === 'change') {
                    readFile(cb);
                  }
                });
              }
            });    
          }
        });
    }

    return app;

  }
}
