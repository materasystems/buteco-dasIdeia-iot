(() => {
  'use strict';

  /**
   * Module dependencies.
   */
  let express = require('express'),
    routes = require('./routes'),
    Redis = require('ioredis'),
    config = require('./package.json'),
    database = require('./database.json'),
    redis = new Redis(),
    app = module.exports = express.createServer(),
    io = require('socket.io')(app);

  // Configuration

  app.configure(() => {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });

  app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });
  app.configure('production', function () {
    app.use(express.errorHandler());
  });

  //Banco de Dados
  redis.get('version', (err, result) => {
    if(err || result !== config.version){
      redis.set('version', config.version);
      redis.set('chegadas', '[]');

      database.users.forEach(user => (
        redis.set(user.code, JSON.stringify(user.dados))
      ));
      console.log('Banco de dados Atualizado');

    } else {
      console.log('Banco de dados na versao', result);
    }
  });

  // Routes
  app.get('/', routes.index);
  app.get('/cartao', (req, res) => {

    redis.get(req.query.code)
      .then(person => {
        redis.get('chegadas').then(arrives => {
          let resultJSON = JSON.parse(person),
            chegadasJson = JSON.parse(arrives);

          resultJSON.horario = new Date().getTime();
          chegadasJson.push(resultJSON);

          redis.set('chegadas', JSON.stringify(chegadasJson));
          io.sockets.emit('cartao',chegadasJson);
          res.json({status: 'ok'});
        });
      })
      .catch(err => (res.json(err)));

  });

  app.get('/chegadas', (req, res) => {
    redis.get('chegadas')
      .then(result =>{
        res.json(JSON.parse(result));
      })
      .catch(err => (res.json(err)));

  });

  app.listen(3000, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });


})();
