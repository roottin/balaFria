//TODO: Armar session

var Sesion = function(){
	var self = this;

	self.autenticar = function(cons){

	}
}
var Session = function(){

	this.perfil = {};

	this.horaDeConexion = "";

	this.estado = "cerrada";

	this.socket = null;

	this.tokenKey = null;

	this.cerrarSession= function(){
		this.destruirSession();
	};

	this.destruirSession = function(){
		this.socket.emit('session',{
			text:'cerrar',
			id:this.perfil.id
		});
	};

	this.recuperarSession = function(){
		jarvis.traza("peticion de recuperacion enviada",'session');
		this.socket.emit('session',{
			text:"recuperar",
			id:this.perfil.id
		});
		this.sesIntId = setInterval(function(){
			if(jarvis.session.nombreusu!==""){
				jarvis.traza("temporalmente sin conexion",'session');
			}
		},30000);
	};

	this.listarPlugs = function(){
		this.socket.emit('plugs',{
			operacion: 'listar',
		});
	};
	this.inicializarConexion = function(){
		this.socket=io(window.location.origin);
		this.socket.on('connect',function(){
			jarvis.traza('conectado2: '+jarvis.session.socket.connected,'session');
		});
		var obj = this.socket;
		this.socket.on('identificacion',function(data){
			if(data.text=="falsa"){
				jarvis.session.nombreusu="";
				jarvis.session.horaDeConexion="";
				jarvis.session.estado="cerrada";
				jarvis.construc.construirAcceso();
			}
		});
		this.socket.on('session',function(data){
			jarvis.traza('peticion recivida: '+data.text,'session');
			if(data.text=="recuperada")
			{
				jarvis.session.nombreusu=data.nombreusu;
				jarvis.session.horaDeConexion=data.horaCon;
				jarvis.session.estado="abierta";
				clearInterval(jarvis.session.sesIntId);
				jarvis.session.sesIntId=null;
				if(jarvis.construc.estructuraActiva===null){
					jarvis.construc.construirInicio();
					jarvis.construc.llenarMenu();
					UI.agregarToasts({
						texto: "Bienvenido "+jarvis.session.nombreusu,
						tipo: 'web-arriba-derecha'
					});
				}
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
				if(this.sesIntId!==null){
					clearInterval(this.sesIntId);
					this.sesIntId=null;
				}
			}
			else
			{
				jarvis.traza('no hay sesion abierta','session');
			}
		});
		this.socket.on('contacto',function(data){
			if(data.accion === 'seguir'){
				var newContac = jarvis.buscarLib('Chat').op.crearChatUnit(data.user);
				UI.buscarVentana('ListadoChats').nodo.appendChild(newContac.userChatCard);
			  UI.agregarToasts({
			    texto: data.user.nombreusu+' te ha agregado',
			    tipo: 'web-arriba-derecha-alto'
			  });
			}else if(data.accion === 'borrar'){
				jarvis.buscarLib('Chat').op.eliminarChatUnit(data.user.nombreusu);
			}
		});
		this.recuperarSession();
	};

	//metodos ejecutados en la instanciacion del objeto
	this.inicializarConexion();
};
