(function () {
  var socket = io();

  socket.on('connect', function(){
    console.log('connected');
  });

  socket.on('cartao', function(data){
    if(data.length > 0){
      showPersonCard(data[data.length - 1], data);
    }
  });

  getEntraceTable();
})();

function showPersonCard(user, entrance){

  var $person = $('.person'),
      $chegadas = $('.chegadas-card');

  $person.children('h1.name').html(user.nome);
  $person.children('.circle-card').css('background-image', 'url('+ user.image +')');
  $person.children('div.horario').children('pre').html('Chegada: ' + user.horario);
  $chegadas.after($person);
  $chegadas.slideToggle('fast');
  $person.fadeIn();
  setTimeout(function() {
    showEntranceTable(entrance);
  }, 6000);
}

function showEntranceTable(entrance) {
  var maxLines = 6;
  var index = entrance.length - 1;
  var stop;

  var $person = $('.person'),
      $chegadas = $('.chegadas-card');

  if(maxLines < entrance.length){
    stop = entrance.length - maxLines;
  }else{
    stop = 0;
  }

  var tableLines = '';
  for(; index >= stop; index--){
    tableLines += getTableLine(entrance[index]);
  }

  $('table.chegadas tbody').html(tableLines);
  if($person.is(':visible')){
    $person.after($chegadas);
    $person.slideToggle('fast');
    $chegadas.fadeIn();
  }
}

function getTableLine(user) {
  var line = '<tr>';
  line += '<th>';
  line += '<img src="' + user.image + '" />';
  line += '</th>';
  line += '<th>';
  line += user.nome;
  line += '</th>';
  line += '<th>';
  line += user.horario;
  line += '</th>';
  line += '</tr>';
  return line;
}

function getEntraceTable(){
  $.ajax({
    url: "/chegadas",
    async:false
  }).done(function( data ) {
    showEntranceTable(data);
  });
}
