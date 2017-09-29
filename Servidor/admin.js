var plugAssembler = require('./plug');
var consAdmin = {};

consAdmin.crear = function(){
	return new Admin();
};
var Admin = function(){
	var self = this;
	self.tipo = "Admin";
	self.conexion = null;

	self.crear =  function(perfil){
		this.perfil = perfil;
		//permite combinar lineas
		return this;
	};

	self.agregarConexion = function(socket){
		if(socket){
			this.conexion= plugAssembler.configure(socket,this.perfil.tipo);
		}
		return this;
	};

	self.cerrarConexion = function(){
		return new Promise(function(resolve,reject){
			this.conexion.socket.emit('desconectado',{text:"session desconectada"});
			this.conexion.socket.disconnect();
		});
	};
};
module.exports = consAdmin;
