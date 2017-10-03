angular.module('balafria')
.controller('ctrlCambiarMenu', ['$mdDialog','$http','$sesion','$mdToast','Menu','$state' ,function ($mdDialog,$http,$sesion,$mdToast,Menu,$state){
  var yo = this;
  $sesion
    .obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
      Menu.consulta({id:yo.usuario.id})
        .$promise.then(function(data){
          yo.lista = data;
        });
    })  
    yo.cambiar = function(index){
      var data = {
        id_menu: yo.lista[index].id_menu,
        id_sucursal: $state.params.sucursal
      }
      $http
        .put('/api/sucursales/cambiarMenu',data)
        .then(function(){          
          $mdDialog.hide(yo.lista[index]);
        })
    }
  yo.cancel = function() {
      $mdDialog.hide();
  };
}]);