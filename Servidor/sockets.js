var socketio = require('socket.io');
var servidor = require('./servidor');
var dateParser = require('./dateParser');
var plugAssembler = require('./plug');

function init(app) {
	var io = socketio(app);
	io.use(function(socket, next){
	    servidor.mostrarListaUsuarios();
	    var usuario = servidor.buscarUsuario(socket.handshake.query.id);
	    var error;
	    if(!usuario){
	    	error = new Error('Error de Autenticacion: Usuario no existe');
	    	console.error(error);
	    	next(error);
	    }else{
	    	if(!usuario.tokenKey == socket.handshake.query.tokenKey){
	    		error = new Error('Error de Autenticacion: token no valida para usuario');
	    		console.error(error)
	    		next(error);
	    	}else{
	    		console.log("Usuario: "+usuario.perfil.nombre+" "+usuario.perfil.apellido+" autenticado");
	    		if(!usuario.buscarConexion("ip",socket.conn.remoteAddress)){
	    			usuario.agregarConexion(socket);
	    			socket.emit('session',{"texto":"recuperda"});
	    			return next();
	    		}else{
	    			console.log('conexion ya existe');
	    		}	
	    	}
	    }	    
	});

	io.sockets.on('connection',function(socket){
	  //-----------inicio SESSION--- ------------------------
	  socket.on('session',function(data){
	    if(data.text=='cerrar')
	    {	    	
	      var Usuario = servidor.buscarUsuario(socket.handshake.query.id);
	      usuario.conexiones.splice(usuario.conexiones.indexOf(usuario.buscarConexion('socket',socket)),1);
	      socket.emit('session',{text:"cerrada"});
	      socket.disconnect();
	      console.log('session de: '+data.nombreusu+" cerrada");
	    }
	    else if(data.text=="recuperar")
	    {
	      var usuario = servidor.buscarUsuario(socket.handshake.query.id);
	      var plug = usuario.buscarConexion('ip',socket.client.conn.remoteAddress);
	      if(plug)
	      {
	        socket.emit('session',{
	          text:"recuperada",
	          usuario:usuario.perfil,
	          horaDeConeccion:plug.horaDeConexion
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
	          usuario:"",
	          horaDeConexion:""
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
      console.log(data);
    });
	socket.on('connect_failed', function(){
		console.log('Connection Failed');
	});
	socket.on('disconnect',function(){
		var usuario = servidor.buscarUsuario(socket.handshake.query.id);
	    var plug = usuario.buscarConexion('socket',socket);
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
