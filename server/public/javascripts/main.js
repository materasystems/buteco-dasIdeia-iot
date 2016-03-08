(function () {
  var socket = io();

  socket.on('connect', function(){
    log('Connected');
  });

  socket.on('cartao', function(data){
    log(JSON.stringify(data));
  });

  function log(value) {
    $('#log').prepend('\n').prepend(value);
  }
})();
