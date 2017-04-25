var plugAssembler = require('./plug');
var consUsuario = {};

consUsuario.crear = function(){
	return new Usuario();
};
var Usuario = function(){
	var self = this;
	self.tipo = "usuario";
	self.conexiones = [];

	self.crear =  function(perfil){
		this.perfil = perfil;
		//permite combinar lineas
		return this;
	};

	self.agregarConexion = function(socket){
		if(socket){
			this.conexiones.push(plugAssembler.configure(socket,this.perfil.tipo));
		}
		return this;
	};

	self.buscarConexion = function(llave,valor){
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
	};
	self.cerrarConexiones = function(){
		var yo = this;
		return Promise.all(
			yo.conexiones.map(function(conexion){
				return yo.cerrarConexion(conexion);
			})
		);
	};
	self.cerrarConexion = function(conexion){
		return new Promise(function(resolve,reject){
			conexion.socket.emit('desconectado',{text:"session desconectada"});
			conexion.socket.disconnect();
		});
	};
};
module.exports = consUsuario;
//TODO: notificaciones de usuario
