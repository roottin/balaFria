var socketio = require('socket.io');
var rack = require('./racks');
var dateParser = require('./dateParser');
var plugAssembler = require('./plug');
var evento  = require('events');
var channel = new evento.EventEmitter();

function init(server) {

	var io = socketio(server);

	io.sockets.on('connection',function(socket){
	  //--------inicio identificacion ------------------------
	  socket.on('identificacion',function(data){
	    var atributos = {
	      nombreusu:data.nombre,
	      horaDeConeccion:data.HDC,
	      ultimaConeccion:new Date(),
	    };
	    if(rack.buscarPlug(atributos.nombreusu)){
	      socket.emit('identificacion',{text:"falsa"});
	      rack.buscarPlug(atributos.nombreusu).socket.emit('session',{text:"dobleSession"});
	      console.log('doble session');
	    }else{
	      var plug = plugAssembler.configure(atributos,socket);
	      rack.addPlug(plug);
	      //identificacion en servidor
	      console.log('\nconexion establecida con: '+plug.nombreusu+"\nde direccion: "+plug.ip+"\n");
	      rack.mostrarListaPlugs();
	    }
	  });
	  //-----------inicio SESSION--- ------------------------
	  socket.on('session',function(data){
	    if(data.text=='cerrar')
	    {
	      rack.removePlug(data.nombreusu);
	      socket.emit('session',{text:"cerrada"});
	      console.log('session de: '+data.nombreusu+" cerrada");
	    }
	    else if(data.text=="recuperar")
	    {
	      var plug = rack.buscarPlugPorIp(socket.client.conn.remoteAddress);
	      if(plug)
	      {
	        socket.emit('session',{
	          text:"recuperada",
	          nombreusu:plug.nombreusu,
	          horaDeConeccion:plug.horaDeConeccion
	        });
	        //activo el plug
	        plug.estado='conectado';
	        //cierro el intervalo de cierre
	        clearInterval(plug.idIntSes);
	      }
	      else
	      {
	        socket.emit('session',{
	          text:"no recuperada",
	          nombreusu:"",
	          horaDeConeccion:""
	        });
	      }
	    }
	  });
	  socket.on('plugs',function(data){
	  	console.log('peticion de control');
	  	if(data.operacion == "listar"){
	  		rack.mostrarListaPlugs();
	  	}
	  });
    socket.on('contacto',function(data){
      console.log('data');
    });
	  socket.on('connect_failed', function(){
	    console.log('Connection Failed');
	  });
	  socket.on('disconnect',function(){
	    plug=rack.buscarPlugPorSocket(socket);
	    if(plug){
	      plug.estado='esperando';
	      //funcion settimeout
	      plug.idIntSes=setTimeout(
	        (function(plug){
	          return function(){
	            if(plug.estado=='esperando'){
	              rack.removePlug(plug.nombreusu);
	            }
	      		};
					})(plug), 120000);
	    }
	  });
	});
    return io;
}

module.exports = init;
