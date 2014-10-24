var Server = require('./lib/server')
  , cluster = require('cluster');


if (cluster.isMaster) {
  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

} else {

  var app = Server.newApplication();
  app.monitorFile(function(err, revision) {
    if (err) {
      console.log('Error monitoring file: ' + e);
    } else {
      console.log('Worker ' + cluster.worker.id + ' article cache updated' + 
        '. New revision: ' + revision);      
    }
  });

  var port = 5000;
  app.listen(port, function() {
    console.log('Worker ' + cluster.worker.id + " listening on " + port);
  });  

}

