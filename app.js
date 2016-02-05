var http      = require('http');
var mongoose  = require('mongoose');
var express   = require('express');

var app    = express();
var db;

var config = {
      "USER"    : "",           
      "PASS"    : "",
      "HOST"    : "/opt/bitnami/mongodb/tmp/mongodb-27017.sock",  
      "PORT"    : "27017", 
      "DATABASE" : "test"
    };

var dbPath  = "mongodb://"+config.USER + ":"+
    config.PASS + "@"+
    config.HOST + ":"+
    config.PORT + "/"+
    config.DATABASE;
var standardGreeting = 'Hello World!';

var greetingSchema = mongoose.Schema({
  sentence: String
}); 
var Greeting= mongoose.model('Greeting', greetingSchema);

db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {
  var greeting;
  Greeting.find( function(err, greetings){
   if( !greetings ){     
      greeting = new Greeting({ sentence: standardGreeting }); 
      greeting.save();
    } 
  }); 
});

app.get('/testdb', function(req, res) {
  Greeting.findOne(function (err, greeting) {
    res.send(greeting.sentence);
  });
});

app.get('/', function(req, res) {
//  Greeting.findOne(function (err, greeting) {
//    res.send(greeting.sentence);
//  });
    res.send(200, "Hello world !");
});

app.use(function(err, req, res, next){
  if (req.xhr) {
    res.send(500, 'Something went wrong!');
  }
  else {
    next(err);
  }
});

console.log('starting the Express (NodeJS) Web server');
app.listen(80);
console.log('Webserver is listening on port 80');