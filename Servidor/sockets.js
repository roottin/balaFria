var socketio = require('socket.io');
var servidor = require('./servidor');
var dateParser = require('./dateParser');
var plugAssembler = require('./plug');

function init(app) {
	var io = socketio(app);
	io.use(function(socket, next){
			console.log('SESION: conexion socket establecida');
			console.log('Autenticando:',socket.handshake.query);
			var error;
			//verificacion usuario o admin
			if(socket.handshake.query.tipo == 'admin'){
				console.log('Autenticacion: ADMIN autenticado');
				console.log('-----------------------------');
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
				console.log('Autenticacion: conexion de usuario');
				var usuario = servidor.buscarUsuario(socket.handshake.query.id,socket.handshake.query.tipo);
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
			    		var conexion = usuario.buscarConexion("ip",socket.conn.remoteAddress);
			    		if(!conexion){
			    			usuario.agregarConexion(socket,socket.handshake.query.tokenKey);
			    			socket.emit('session',{"texto":"recuperada"});
							servidor.notificar("conexion",usuario.perfil);
						    servidor.mostrarListaUsuarios();
			    			return next();
			    		}else{
			    			console.log('SESION: conexion recuperda');
			    			conexion.estado = "recuperda";
			    			conexion.socket = socket;
			    			socket.emit('session',{
			    				"texto":"recuperada",
			    				"usuario":usuario.perfil
			    			});
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
	      var Usuario = servidor.buscarUsuario(socket.handshake.query.id,socket.handshake.query.tipo);
				if(Usuario){
					Usuario.conexiones.splice(Usuario.conexiones.indexOf(Usuario.buscarConexion('socket',socket)),1);
					if(!Usuario.conexiones){
						servidor.removeUsuario(Usuario.perfil.id);
					}
				}else if(servidor.admin){
					if(servidor.admin.conexion){
						if(servidor.admin.conexion.socket == socket){
							//NOTE: desoneccion admin
						  console.log('----ADMIN DESCONECTADO----');
							servidor.admin = null;
							Usuario = {perfil:{nombre:"admin"}};
						}
					}
				}
	      socket.emit('session',{texto:"cerrada"});
	      socket.disconnect();
		  servidor.notificar("desconexion",Usuario.perfil);
	      console.log('session de: '+Usuario.perfil.nombre+" cerrada");
	    }
	    else if(data.texto=="recuperar")
	    {
	      var usuario = servidor.buscarUsuario(socket.handshake.query.id,socket.handshake.query.tipo);
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
		var usuario = servidor.buscarUsuario(socket.handshake.query.id,socket.handshake.query.tipo);
		console.log(socket.handshake.query);
		var plug;
		if(usuario){
			plug = usuario.buscarConexion("ip",socket.conn.remoteAddress);
		}else if(servidor.admin){
			usuario = servidor.admin;
			plug = servidor.admin.conexion;
		}
		if(plug){
			console.log("SESION: plug colocado en espera");
			console.log('-----------------------------');
			plug.estado='esperando';
			//funcion settimeout
			plug.idIntSes=setTimeout(
				(function(plug){
					return function(){
					if(plug.estado=='esperando'){
						console.log("SESION: plug desconectado");
						console.log('-----------------------------');

						usuario.cerrarConexion(plug);
					}
				};
			})(plug), 20000);
		}
	  });
	});
    return io;
}

module.exports = init;
