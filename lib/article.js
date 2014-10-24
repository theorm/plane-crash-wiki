var fs = require('fs')
  , crypto = require('crypto');


module.exports = {
  /*
    Read article file and return the content as the second argument.
  */
  read: function(filename, cb) {
    fs.readFile(filename, null, function(err, data) {
        if (err) {
          console.error('Failed reading file: ', e);
          if (cb) cb(e);
        } else {
          if (cb) cb(null, data);
        }
      });
  },

  /*
    Update article text.
  */
  save: function(filename, text, cb) {
    fs.open(filename, 'w', null, function(err, fd) {
        if (err) {
          if (cb) cb(err);
        } else {
          var buffer = new Buffer(text);
          console.log('B: ' + buffer);
          fs.write(fd, buffer, 0, buffer.length, 0, function(err) {
            if (err) {
              if (cb) cb(err);
            } else {
              console.log('close')
              fs.close(fd, cb);
            }
          });
        }
      });
  },

  /*
    Get revision of the article text.
  */
  getRevision: function(text, cb) {
    var shasum = crypto.createHash('sha1')
    shasum.update(text);
    revision = shasum.digest('hex');

    if(cb) cb(null, revision);
  },

  /*
    Check if article file exists.
  */
  checkExists: function(filename, cb) {
    fs.exists(filename, function(exists) {
      if (cb) cb(null, exists);
    });
  }
}