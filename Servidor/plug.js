var plugAssembler= {};

plugAssembler.configure = function(socket,tipo){
	var plug = {
		ultimaConexion: new Date(),
		horaDeConexion: new Date(),
		socket: socket,
		estado: "conectado",
		idIntSes: null,
		ip: socket.conn.remoteAddress
	};
	return plug;
};
module.exports = plugAssembler;
