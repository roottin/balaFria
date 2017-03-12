var plugAssembler = require('./plug');
var Usuario = {};
Usuario.conexiones = [];

Usuario.crear =  function(perfil){
	this.perfil = perfil;
	//permite combinar lineas
	return this;
}

Usuario.agregarConexion = function(socket){
	if(socket){
		this.conexiones.push(plugAssembler.configure(socket));
	}
	return this;
}

Usuario.buscarConexion = function(tipo,valor){
	var resultado = false;
	this.conexiones.forEach(function(conexion){
		if(conexion.hasOwnProperty(llave)){
			if(conexion[llave] == valor){
				resultado = conexion;
			}	
		}else{
			console.error("conexion no posee la propiedad "+llave);
		}
	});
	return resultado;
}
Usuario.cerrarConexiones = function(){
	var yo = this;
	return Promise.all(
		yo.conexiones.map(function(conexion){
			return yo.cerrarConexion(conexion);
		})
	);
}
Usuario.cerrarConexion = function(conexion){
	return new Promise(function(resolve,reject){
		conexion.socket.emit('desconectado',{text:"session desconectada"});
		conexion.socket.disconnect();
	});
}
//TODO: notificaciones de usuario