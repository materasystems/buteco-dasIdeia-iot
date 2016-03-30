
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  Redis = require('ioredis'),
  config = require('./package.json'),
  database = require('./database.json'),
  redis = new Redis(),
  app = module.exports = express.createServer(),
  io = require('socket.io')(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//Banco de Dados
redis.get('version', function (err, result) {
  if(err || result !== config.version){
    redis.set('version', config.version);
    redis.set('chegadas', '[]');

    for(i = 0; i < database.users.length; i++){
      redis.set(database.users[i].code, JSON.stringify(database.users[i].dados));
    }
    console.log('Banco de dados Atualizado');
  }else{
      console.log('Banco de dados na versao', result);
  }
});

// Routes
app.get('/', routes.index);
app.get('/cartao', function (req, res) {

  redis.get(req.query.code)
    .then(result =>{
      var answer = {};
      redis.get('chegadas').then(r => {
        var resultJSON = JSON.parse(result);
        var chegadasJson = JSON.parse(r);
        resultJSON.horario = getTimeFormated();
        chegadasJson.push(resultJSON);
        answer = chegadasJson;
        redis.set('chegadas', JSON.stringify(answer));
        io.sockets.emit('cartao',answer);
        res.json({status: 'ok'});
      });
    })
    .catch(err => (res.json(err)));

});

function getTimeFormated(){
  var time = '';
  var date  = new Date();
  time += date.getHours();
  time += ':';
  time += date.getMinutes();
  time += ':';
  time += date.getSeconds();
  return time;
}

app.get('/chegadas', function (req, res) {
  redis.get('chegadas')
    .then(result =>{
      res.json(JSON.parse(result));
    })
    .catch(err => (res.json(err)));

});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
