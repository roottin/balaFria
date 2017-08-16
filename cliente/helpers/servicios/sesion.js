angular.module('balafria')
.service('$sesion',['$rootScope','$state','$http',function($rootScope,$state,$http){
  var self = this;
  self.iniciazar = function(){
    return {
      perfil : null,
      socket : null,
      estado : "desconectado",
      notificaciones : []
    }
  }
  if(!$rootScope.sesion){
    $rootScope.sesion = self.iniciazar();
  }

  self.obtenerPerfil = function(){
    if($rootScope.sesion.estado == "desconectado"){
      var datosSesion = sessionStorage.getItem('balaFria_token');
      if(!datosSesion){
        $state.go('cliente');
      }else{
        datosSesion = JSON.parse(datosSesion);
        return new Promise(function(completado,rechazado){
          $http.post('/api/recuperar',datosSesion)
            .then(function(resultado){
              if(!resultado.data.success){
                $state.go('cliente');
              }else{
                $rootScope.sesion.perfil = resultado.data.user;
                $rootScope.sesion.tipo = $rootScope.sesion.perfil.tipo;
                self.conectar();
                if(($rootScope.sesion.tipo == "cliente")&&($state.current.name!="cliente.iniciado")){
                  $state.go('cliente.iniciado');
                }else{
                  completado($rootScope.sesion.perfil);
                }
              }
            })
            .catch(function(err){
              console.error(new Error(err));
            });
        });
      }
    }else{
      return Promise.resolve($rootScope.sesion.perfil);
    }
  }
  self.crear = function(perfil,tipo){
    $rootScope.sesion.perfil = perfil;
    $rootScope.sesion.perfil.tipo = tipo;
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
      $http.get('/api/'+$rootScope.sesion.perfil.tipo+'/'+$rootScope.sesion.perfil.id)
        .then(function(resultado){
          console.log(resultado);
        })
        .catch(function(err){
          console.error(new Error(err));
        })
    });
  }
  self.conectar = function(){
    $rootScope.sesion.estado = "conectado";
    $rootScope.sesion.socket = io.connect('',{
      'transports': ['websocket', 'polling'],
      "query":"id="+$rootScope.sesion.perfil.id+
              "&tipo="+$rootScope.sesion.perfil.tipo+
              "&tokenKey="+$rootScope.sesion.perfil.token
    });

    $rootScope.sesion.socket.on('init',function(data){
      console.log($rootScope.sesion.perfil);
    });
    $rootScope.sesion.socket.on('session',function(data){
      if(data.texto === 'cerrada'){
        console.log('socket desconectado');
        $rootScope.sesion.socket = null;
        $rootScope.sesion.perfil = null;
      }
    });
    return self;
  };
  self.buscarNotificaciones = function(){
    if($rootScope.sesion.perfil){
      $http.get('api/notificacion/'+perfil.tipo+'/'+perfil.id)
        .then(function(resultado){
          $rootScope.sesion.notificaciones = resultado.data.notificaciones;
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
    if($rootScope.sesion.socket){
      $rootScope.sesion.socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply($rootScope.sesion.socket, args);
        });
      });
    }
  };
  self.emit = function (eventName, data, callback) {
    if($rootScope.sesion.socket){
      $rootScope.sesion.socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply($rootScope.sesion.socket, args);
          }
        });
      });
    }
  };
  self.desconectar = function(){
    sessionStorage.clear();
    $rootScope.sesion.socket.emit('session',{"texto":'cerrar'});
  };
}]);
