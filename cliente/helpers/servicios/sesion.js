angular.module('balafria')
.service('$sesion',['$rootScope','$state','$http',function($rootScope,$state,$http){
  var self = this;
  self.perfil = null;
  self.socket = null;
  self.estado = "desconectado";
  self.notificaciones = [];

  self.obtenerPerfil = function(){
    if(self.estado == "desconectado"){
      var datosSesion = sessionStorage.getItem('balaFria_token');
      if(!datosSesion){
        $state.go('frontPage');
      }else{
        datosSesion = JSON.parse(datosSesion);
        return new Promise(function(completado,rechazado){
          $http.post('/api/recuperar',datosSesion)
            .then(function(resultado){
              if(!resultado.data.success){
                $state.go('frontPage');
              }else{
                self.perfil = resultado.data.user;
                self.tipo = self.perfil.tipo;
                self.conectar();
                if(self.tipo == "cliente"){
                  $state.go('frontPage.iniciado');
                }else{
                  $state.go('proveedor.dashboard');
                }
              }
            })
            .catch(function(err){
              console.error(new Error(err));
            });
        });
      }
    }else{
      return self.perfil;
    }
  }

  self.crear = function(perfil,tipo){
    self.perfil = perfil;
    self.perfil.tipo = tipo;
    var storage = {
      "token": perfil.token,
      "nombre": perfil.nombre,
      "tipo": tipo,
      "id": perfil.id
    };
    //NOTE: guardando en el session storage
    var tokenName = "balaFria_token";
    sessionStorage.setItem(tokenName,JSON.stringify(storage));
    return self;
  };
  self.actualizarDatos = function($http){
    return new Promise(function(completada,rechazada){
      $http.get('/api/'+self.perfil.tipo+'/'+self.usuario.id)
        .then(function(resultado){
          console.log(resultado);
        })
        .catch(function(err){
          console.error(new Error(err));
        })
    });
  }
  self.conectar = function(){
    self.estado = "conectado";
    self.socket = io.connect('',{
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
  self.buscarNotificaciones = function(){
    if(self.perfil){
      $http.get('api/notificacion/'+perfil.tipo+'/'+perfil.id)
        .then(function(resultado){
          self.notificaciones = resultado.data.notificaciones;
          //inicializo el modulo
          self.on('modNot',function(data){
            console.log(data);
            //muestro contenido de la notificacion segun el tipo
              //trivial: toast
              //accion-corta: toast
              //accion-larga: modal
              //urgente: modal
          });
        })
        .catch(function(err){
          console.error(new Error(err));
        });
    }else{
      console.error('Perfil no se encuentra inicializado para buscar notificaciones');
    }
  }
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
    sessionStorage.clear();
    self.socket.emit('session',{"texto":'cerrar'});
  };
}]);
