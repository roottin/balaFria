angular.module('balafria')
.service('$sesion',function($rootScope){
  var self = this;
  self.perfil = null;
  self.socket = null;

  self.crear = function(perfil,tipo){
    self.perfil = perfil;
    self.perfil.tipo = tipo;
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
  //control de socket
  self.on = function (eventName, callback) {
    if(self.socket){
      self.socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(self.socket, args);
        });
      });

    }
  };
  self.emit = function (eventName, data, callback) {
    if(self.socket){
      self.socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(self.socket, args);
          }
        });
      });
    }
  };
  self.desconectar = function(){
    self.socket.emit('session',{"texto":'cerrar'});
  };
});
