var plugAssembler= {};

plugAssembler.configure = function(tipo,socket){
	var plug = {
		ultimaConexion: new Date(),
		horaDeConexion: new Date(),
		socket: socket,
		estado: "conectado",
		idIntSes: null,
		ip: socket.client.conn.remoteAddress
	};
	return plug;
};
module.exports = plugAssembler;
