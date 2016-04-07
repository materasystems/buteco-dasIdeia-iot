(function () {
  var socket = io();
  moment.locale('pt-BR');

  socket.on('connect', function(){
    console.log('connected');
  });

  socket.on('cartao', function(data){
    if(data.length > 0){
      showPersonCard(data[data.length - 1], data);
    }
  });

  getEntraceTable();

  updateTime();
  setInterval(updateTime, 10000); // 10 secs
})();

var actualTimeouID;

function showPersonCard(user, entrance){

  var $person = $('.person'),
      $chegadas = $('.chegadas-card');

  $person.children('.text').children('.name').html(user.nome);
  $person.children('.circle-card').css('background-image', 'url('+ user.image +')');
  
  if($chegadas.is(':visible')){
    $chegadas.after($person);
    $chegadas.slideToggle('fast');
  }

  if(!$person.is(':visible')){
    $person.fadeIn();
  }

  //Evita que a tabela de ultimas entradas apareça antes de ser atualizada
  clearTimeout(actualTimeouID);

  actualTimeouID = setTimeout(function() {
    showEntranceTable(entrance);
  }, 3000);
}

function showEntranceTable(entrance) {
  var maxLines = 6,
    index = entrance.length - 1,
    stop;

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
  }

  if(!$chegadas.is(':visible')){
    $chegadas.fadeIn();
  }
}

function getTableLine(user) {
  var line = '<tr>';
  line += '<td>';
  line += '<img src="' + user.image + '" />';
  line += '</td>';
  line += '<td>';
  line += user.nome;
  line += '</td>';
  line += '<td data-timestamp="' + user.horario + '">';
  line += '</td>';
  line += '</tr>';
  return line;
}

function getEntraceTable(){
  $.ajax({ url: "/chegadas" })
  .done(showEntranceTable);
}

function updateTime() {
  $('[data-timestamp]').each(function (index, element) {
    var timestamp = $(element).data('timestamp');

    $(element).html( moment(timestamp).fromNow() )
    .attr('title', moment(timestamp).format('hh:mm:ss'));
  });
}
