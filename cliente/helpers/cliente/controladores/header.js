angular.module('balafria')
.controller('ctrlHeaderCli', ['$state','$sesion','$auth','$mdDialog','$http','$mdSidenav', function ($state,$sesion,$auth,$mdDialog,$http,$mdSidenav){
  var yo = this;
  $sesion.obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
      $sesion
        .actualizarDatos($http)
        .then(function(usuarioFull){
          yo.usuario = usuario;
        });
    })
    .catch(function(error){
      console.log(error);
    });
  yo.logOut = function(){
    $auth.logout()
          .then(function() {
              // Desconectamos al usuario y lo redirijimos
              $sesion.desconectar();
              $state.go("cliente");
          });
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
  }
  yo.toggleLeft = buildToggler('left');
  yo.toggleRight = buildToggler('right');

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }
}])
