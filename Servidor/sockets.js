var socketio = require('socket.io');
var servidor = require('./servidor');
var dateParser = require('./dateParser');
var plugAssembler = require('./plug');

function init(app) {
	var io = socketio(app);
	io.use(function(socket, next){
			var error;
	    servidor.mostrarListaUsuarios();
			//verificacion usuario o admin
			if(socket.handshake.query.tipo == 'admin'){
				if(servidor.admin){
					if(servidor.admin.perfil.token == socket.handshake.query.tokenKey){
						servidor.admin.agregarConexion(socket);
						socket.emit('session',{"texto":"recuperada"});
						return next();
					}else{
						error = new Error('Error de Autenticacion: token no valida para usuario');
						console.error(error);
						next(error);
					}
				}
			}else{
				var usuario = servidor.buscarUsuario(socket.handshake.query.id);
		    if(!usuario){
		    	error = new Error('Error de Autenticacion: Usuario no existe');
		    	console.error(error);
		    	next(error);
		    }else{
		    	if(usuario.tokenKey == socket.handshake.query.tokenKey){
		    		error = new Error('Error de Autenticacion: token no valida para usuario');
		    		console.error(error);
		    		next(error);
		    	}else{
		    		console.log("Usuario: "+usuario.perfil.nombre+" "+usuario.perfil.apellido+" autenticado");
		    		if(!usuario.buscarConexion("ip",socket.conn.remoteAddress)){
							servidor.notificar("conexion",usuario.perfil);
		    			usuario.agregarConexion(socket);
		    			socket.emit('session',{"texto":"recuperada"});
		    			return next();
		    		}else{
		    			console.log('conexion ya existe');
		    			socket.emit('session',{"texto":"recuperada"});
		    			return next();
		    		}
		    	}
		    }
			}
	});

	io.sockets.on('connection',function(socket){
	  //-----------inicio SESSION--- ------------------------
	  socket.on('session',function(data){
	    if(data.texto=='cerrar')
	    {
	      var Usuario = servidor.buscarUsuario(socket.handshake.query.id);
				if(Usuario){
					Usuario.conexiones.splice(Usuario.conexiones.indexOf(Usuario.buscarConexion('socket',socket)),1);
				}else if(servidor.admin){
					if(servidor.admin.conexion){
						if(servidor.admin.conexion.socket == socket){
							//NOTE: desoneccion admin
						  console.log('----ADMIN DESCONECTADO----');
							servidor.admin = null;
						}
					}
				}
	      socket.emit('session',{texto:"cerrada"});
	      socket.disconnect();
	      console.log('session de: '+data.nombreusu+" cerrada");
	    }
	    else if(data.texto=="recuperar")
	    {
	      var usuario = servidor.buscarUsuario(socket.handshake.query.id);
	      var plug = usuario.buscarConexion('ip',socket.client.conn.remoteAddress);
	      if(plug)
	      {
	        socket.emit('session',{
	          texto:"recuperada",
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
	          texto:"no recuperada",
	          usuario:"",
	          horaDeConexion:""
	        });
	      }
	    }
	  });
	socket.on('plugs',function(data){
		console.log('peticion de control');
		if(data.operacion == "listar"){
			servidor.mostrarListaPlugs();
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
		var plug;
		if(usuario){
			plug = usuario.buscarConexion('socket',socket);
		}else if(servidor.admin){
			plug = servidor.admin.conexion;
		}
		if(plug){
			plug.estado='esperando';
			//funcion settimeout
			plug.idIntSes=setTimeout(
				(function(plug){
					return function(){
					if(plug.estado=='esperando'){
						usuario.cerrarConexion(plug);
					}
				};
			})(plug), 120000);
		}
	  });
	});
    return io;
}

module.exports = init;
