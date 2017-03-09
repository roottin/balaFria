
//variable para peticion asincrona de sesion
var conexionSess;
//----------------------------------------------OBJETO SESSION--------------------------------------//
var Session = function(){

	this.nombreusu = "";

	this.horaDeConexion = "";

	this.estado = "cerrada";

	this.socket = null;

	this.sesIntId = null;

	this.cerrarSession= function(){
		this.destruirSession();
		bone.construc.construirAcceso();
	};

	this.destruirSession = function(){
		this.socket.emit('session',{
			text:'cerrar',
			nombreusu:this.nombreusu
		});
	};

	this.recuperarSession = function(){
		bone.traza("peticion de recuperacion enviada",'session');
		this.socket.emit('session',{
			text:"recuperar",
			nombreusu:this.nombreusu
		});
		this.sesIntId = setInterval(function(){
			if(bone.session.nombreusu!==""){
				bone.traza("temporalmente sin conexion",'session');
			}
		},30000);
	};

	this.identificacion = function(){
		bone.traza('identificacion enviada','session');
		this.socket.emit('identificacion',{
			nombre: bone.session.nombreusu,
			HDC: bone.session.horaDeConexion
		});
		if(this.sesIntId!==null){
			clearInterval(this.sesIntId);
			this.sesIntId=null;
		}
		setInterval(function(){
			bone.session.recuperarSession();
		},50000);
	};

	this.listarPlugs = function(){
		this.socket.emit('plugs',{
			operacion: 'listar',
		});
	};
	this.inicializarConexion = function(){
		//var port = process.env.PORT || 4000;
		this.socket=io();
		bone.traza('conectado1: '+this.socket.connected,'session');
		this.socket.on('connect',function(){
			bone.traza('conectado2: '+bone.session.socket.connected,'session');
		});
		var obj = this.socket;
		this.socket.on('identificacion',function(data){
			if(data.text=="falsa"){
				bone.session.nombreusu="";
				bone.session.horaDeConexion="";
				bone.session.estado="cerrada";
				bone.construc.construirAcceso();
			}
		});
		this.socket.on('session',function(data){
			bone.traza('peticion recivida: '+data.text,'session');
			if(data.text=="recuperada")
			{
				bone.session.nombreusu=data.nombreusu;
				bone.session.horaDeConexion=data.horaCon;
				bone.session.estado="abierta";
				clearInterval(bone.session.sesIntId);
				bone.session.sesIntId=null;
				if(bone.construc.estructuraActiva===null){
					bone.construc.construirInicio();
					bone.construc.llenarMenu();
					UI.agregarToasts({
						texto: "Bienvenido "+bone.session.nombreusu,
						tipo: 'web-arriba-derecha'
					});
				}
			}
			else if(data.text=="cerrada")
			{
				bone.session.nombreusu="";
				bone.session.horaDeConexion="";
				bone.session.estado="cerrada";
				bone.construc.construirAcceso();
			}
			else if(data.text=="agotada")
			{
				bone.traza('tiempo agotado inicie de nuevo','session');
				bone.session.nombreusu="";
				bone.session.horaDeConexion="";
				bone.session.estado="cerrada";
				bone.construc.construirAcceso();
			}
			else if(data.text=="dobleSession")
			{
				bone.traza('sesion ya se encuentra iniciada en otro lugar','session');
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
				bone.traza('no hay sesion abierta','session');
			}
		});
		this.socket.on('contacto',function(data){
			if(data.accion === 'seguir'){
				var newContac = bone.buscarLib('Chat').op.crearChatUnit(data.user);
				UI.buscarVentana('ListadoChats').nodo.appendChild(newContac.userChatCard);
			  UI.agregarToasts({
			    texto: data.user.nombreusu+' te ha agregado',
			    tipo: 'web-arriba-derecha-alto'
			  });
			}else if(data.accion === 'borrar'){
				bone.buscarLib('Chat').op.eliminarChatUnit(data.user.nombreusu);
			}
		});
		this.socket.on('chatMsg',function(data){
			if(data.tipo=='envio'){
				bone.traza('mensaje llego a receptor','chat');
				data.estado = 'R';
				//envio el cambio de estado
				var newData = {
					tipo: 'cambioEstado',
					id : data.id,
					mensaje : 'recibidoPorReceptor',
					emisor : data.emisor
				};
				//en caso de que este el chat abierto lo escribo en el chat
				if(bone.buscarLib('Chat').op.chatActivo){
					if(bone.buscarLib('Chat').op.chatActivo.user.nombreusu === data.emisor){
						newData.estado = 'L';
						bone.buscarLib('Chat').op.agregarMensaje(data);
					}else{
						//cuando el chat esta inactivo aumento el numero de mensajes pendientes y los aumento
						newData.estado='R';
						bone.buscarLib('Chat').op.activarNotificacion(data);
					}
				}else{
					//cuando no hay ningun chat activo
					newData.estado='R';
					bone.buscarLib('Chat').op.activarNotificacion(data);
				}
				bone.traza('envio cambio de estado','chat');
				bone.session.socket.emit('chatMsg',newData);
			}else if(data.tipo=='cambioEstado'){
				bone.traza('cambio de estado '+data.estado,'chat');
				bone.traza(data,'chat');
				if(bone.buscarLib('Chat')){
					bone.buscarLib('Chat').op.actualizarMensaje(data);
				}
			}
		});
		this.recuperarSession();
	};

	//metodos ejecutados en la instanciacion del objeto
	this.inicializarConexion();
};
