angular.module('balafria')
.controller('ctrlHeaderCli', ['$scope','Paises','Ciudades','$rootScope','$state','$sesion','$auth','$mdDialog','$http','$mdSidenav','$mdToast', function ($scope,Paises,Ciudades,$rootScope,$state,$sesion,$auth,$mdDialog,$http,$mdSidenav,$mdToast){
  var yo = this;
  yo.ciudadesAct = [];
  //optencion de datos
  $sesion.obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
      $sesion
        .actualizarDatos($http)
        .then(function(usuarioFull){
          yo.usuario = usuarioFull.data;
          yo.asignarCiudad(usuarioFull.data.ciudad);
        });
    })
    .catch(function(error){
      yo.usuario = null;
    });
  Paises
    .query()
    .$promise
    .then(function(paises){
      yo.paises = paises
    })
  Ciudades
    .query()
    .$promise
    .then(function(ciudades){
      yo.ciudades = ciudades;
      $scope.ciudad = 1;
      $scope.pais = 1;
    })
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.$apply(function(){
        $rootScope.position = position; //Obtenemos info de la localizaicon
        $rootScope.$broadcast("ubicacion obtenida",position);
      });
    });
  }
  //------------------ Eventos ---------------------------------
  $scope.$on('sesion finalizada',function(event,args){
    $scope.usuario = null
  });
  $scope.$watch(function(scope) { return scope.ciudad },
      function(newValue, oldValue) {
        if(newValue){
          yo.asignarCiudad(newValue);
        }
      }
     );
  $scope.$watch(function(scope) { return scope.pais },
      function(newValue, oldValue) {
          if(newValue){
            yo.ciudadesAct = [];
            yo.ciudades.forEach(function(ciudad){
              if(ciudad.id_pais == newValue){
                yo.ciudadesAct.push(ciudad);
              }
            });
          }
      }
     );
    //------------------ Manejo de Autenticacion---------------------------------
    yo.registro = function(){
        $http.post('/api/cliente',yo.cliente)
          .then(function(resp){
            var user = {
              "nombre":resp.data.nombre,
              "apellido":resp.data.apellido,
              "documento":resp.data.documento,
              "id":resp.data.id_cliente,
              "email":resp.data.email,
              "token":resp.data.token,
            };
            yo.inicioSesion(user);
          });
    };
    yo.login = function(){
        $auth.login({
          field: yo.field,
          clave: yo.clave,
          tipo: "cliente"
        })
        .then(function(response){
            if(response.data.success){
              yo.inicioSesion(response.data.user);
            }else{
              $mdToast.show(
                $mdToast.simple()
                  .textContent("Error de Autenticacion")
                  .position('top left')
                  .hideDelay(3000)
              );
            }
        })
        .catch(function(response){
          console.error(new Error(response));
        });
    };
  yo.authenticate = function(provider) {
      $auth.authenticate(provider);
    };
  yo.logOut = function(){
    $auth.logout()
          .then(function() {
              // Desconectamos al usuario y lo redirijimos
              $sesion.desconectar();
              yo.usuario = null;
              $rootScope.$broadcast('sesion finalizada');
              yo.toggleRight();
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Sesion cerrada de forma exitosa')
                  .position('top left')
                  .hideDelay(3000)
              );
          });
  };
  yo.inicioSesion = function(user){
    $sesion.crear(user,'cliente').conectar();
    $sesion
      .obtenerPerfil()
      .then(function(perfil){
        yo.usuario = perfil;
        $rootScope.$broadcast('inicio sesion');
        yo.toggleRight();
        $sesion
          .actualizarDatos($http)
          .then(function(usuarioFull){
            yo.usuario = usuarioFull.data;
            $mdToast.show(
              $mdToast.simple()
                .textContent('Bienvenido '+yo.usuario.nombre+' '+yo.usuario.apellido)
                .position('top left')
                .hideDelay(3000)
            );
          });
      })
  };
  //------------------ Manejo de UI ---------------------------------
  yo.asignarCiudad = function(id){
    if(id){
      yo.ciudades.forEach(function(ciudad){
        if(ciudad.id_ciudad == id){
          yo.paises.forEach(function(pais){
            if(pais.id_pais == ciudad.id_pais){
              $rootScope.$broadcast("cambio ciudad",ciudad);
            }
          });
        }
      });
    }
  };
  yo.cambiarImagen = function(ev){
    $mdDialog.show({
      controller: 'ctrlCambiarImg',
      controllerAs: 'form',
      templateUrl: '/views/plantillas/cliente/cambiarImagen.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    }).then(function(cambio){
      console.log(cambio);
      if(cambio){
        yo.usuario = $sesion.actualizarDatos($http);
      }
    });
  };
  yo.irAlInicio = function(){
    $state.go('cliente');
  };
  yo.verPerfil = function(){
    $state.go('cliente.perfil');
  };
  yo.abrirSeguridad = function(){
    $state.go('cliente.perfil');
  };
  yo.toggleLeft = buildToggler('left');
  yo.toggleRight = buildToggler('right');

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }
}])
