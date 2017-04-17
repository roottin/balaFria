angular.module('balafria')
.service('$sesion',function(){
  var self = this;
  self.perfil = {};
  self.socket = null;

  self.crear = function(perfil){
    self.perfil = perfil;
    self.perfil.tipo = 'proveedor';
    return self;
  };
  self.conectar = function(){
    self.socket = io.connect('http://localhost:3000',{
      'transports': ['websocket', 'polling'],
      "query":"id="+self.perfil.id+
              "&tipo="+self.perfil.tipo+
              "&tokenKey="+self.perfil.token
    });

    self.socket.on('init',function(data){
      console.log(self.perfil);
    });
    self.socket.on('session',function(data){
      if(data.texto === 'cerrada'){
        console.log('socket desconectado');
        self.socket = null;
        self.perfil = null;
      }
    });
    return self;
  };
  self.desconectar = function(){
    self.socket.emit('session',{"texto":'cerrar'});
  };
});
