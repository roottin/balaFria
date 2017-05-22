var plugAssembler= {};

plugAssembler.configure = function(socket,tipo,token){
	var plug = {
		ultimaConexion: new Date(),
		horaDeConexion: new Date(),
		socket: socket,
		estado: "conectado",
		idIntSes: null,
		ip: socket.conn.remoteAddress,
		token: token
	};
	return plug;
};
module.exports = plugAssembler;
