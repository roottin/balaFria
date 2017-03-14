
var Sesion = function(){
	var self = this;
	self.perfil = {};
	self.horaDeConexion = "";
	self.estado = "cerrada";
	self.socket = null;
	self.tokenKey = null;

	self.crear = function(perfil,tokenKey){
		self.perfil = perfil;
		self.estado = "creando";
		self.horaDeConexion = new Date();
		self.tokenKey = tokenKey;
		self.autenticar();
		return Promise.resolve();
	}

	self.cerrarSession= function(){
		self.destruirSession();
	};

	self.destruirSession = function(){
		self.socket.emit('session',{
			text:'cerrar',
			id:self.perfil.id
		});
	};

	self.recuperarSession = function(){
		jarvis.traza("peticion de recuperacion enviada",'session');
		self.socket.emit('session',{
			text:"recuperar",
			id:self.perfil.id
		});
		self.sesIntId = setInterval(function(){
			if(jarvis.session.nombreusu!==""){
				jarvis.traza("temporalmente sin conexion",'session');
			}
		},30000);
	};

	self.listarPlugs = function(){
		self.socket.emit('plugs',{
			operacion: 'listar',
		});
	};
	self.autenticar = function(){
		self.socket=io(window.location.origin,{"query":"id="+self.perfil.id+"&tipo="+self.perfil.tipo+"&tokenKey="+self.tokenKey});
		self.socket.on('session',function(data){
			jarvis.traza('peticion recivida: '+data.text,'session');
			if(data.text=="recuperada")
			{
				jarvis.session.estado="abierta";
				bone.usarLib("Usuario")
					.then(function(lib){
						if(!lib.op){
							lib.op = new ConsUsuario();
						}
						lib.op.contruirUI(self);
					});
			}
			else if(data.text=="cerrada")
			{
				jarvis.session.nombreusu="";
				jarvis.session.horaDeConexion="";
				jarvis.session.estado="cerrada";
				jarvis.construc.construirAcceso();
			}
			else if(data.text=="agotada")
			{
				jarvis.traza('tiempo agotado inicie de nuevo','session');
				jarvis.session.nombreusu="";
				jarvis.session.horaDeConexion="";
				jarvis.session.estado="cerrada";
				jarvis.construc.construirAcceso();
			}
			else if(data.text=="dobleSession")
			{
				jarvis.traza('sesion ya se encuentra iniciada en otro lugar','session');
				alert("hubo un intento de acceso a su cuenta desde otra ubicacion");
			}
			else if(data.text=="no recuperada")
			{
				if(self.sesIntId!==null){
					clearInterval(self.sesIntId);
					self.sesIntId=null;
				}
			}
			else
			{
				jarvis.traza('no hay sesion abierta','session');
			}
		});
		
	};
};
