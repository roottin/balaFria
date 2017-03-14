
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
			texto:'cerrar',
			id:self.perfil.id
		});
	};

	self.recuperarSession = function(){
		bone.traza("peticion de recuperacion enviada",'session');
		self.socket.emit('session',{
			texto:"recuperar",
			id:self.perfil.id
		});
		self.sesIntId = setInterval(function(){
			if(self.nombreusu!==""){
				bone.traza("temporalmente sin conexion",'session');
			}
		},30000);
	};
	self.autenticar = function(){
		self.socket=io(window.location.origin,{"query":"id="+self.perfil.id+"&tipo="+self.perfil.tipo+"&tokenKey="+self.tokenKey});
		
		self.socket.on('session',function(data){
			bone.traza('peticion recivida: '+JSON.stringify(data),'session');
			if(data.texto=="recuperada")
			{
				this.estado="abierta";
				bone.usarLib("Usuario")
					.then(function(lib){
						if(!lib.op){
							lib.op = new ConsUsuario();
						}
						lib.op.contruirUI(self);
					});
			}
			else if(data.texto=="cerrada")
			{
				self.nombreusu="";
				self.horaDeConexion="";
				self.estado="cerrada";
				bone.construc.construirAcceso();
			}
			else if(data.texto=="agotada")
			{
				bone.traza('tiempo agotado inicie de nuevo','session');
				self.nombreusu="";
				self.horaDeConexion="";
				self.estado="cerrada";
				bone.usarLib("Usuario")
					.then(function(lib){
						if(!lib.op){
							lib.op = new ConsUsuario();
						}
						lib.op.destruirUI(self);
					});
			}
			else if(data.texto=="dobleSession")
			{
				bone.traza('sesion ya se encuentra iniciada en otro lugar','session');
				alert("hubo un intento de acceso a su cuenta desde otra ubicacion");
			}
			else if(data.texto=="no recuperada")
			{
				if(self.sesIntId!==null){
					clearInterval(self.sesIntId);
					self.sesIntId=null;
				}
			}
			else
			{
				bone.traza('no hay sesion abierta','session');
			}
		});
		
	};
};
