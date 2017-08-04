angular.module('balafria')
.controller('ctrlHeaderPro', ['$state','$sesion','$auth','$mdSidenav','Sucursales','$timeout', function ($state,$sesion,$auth, $mdSidenav,Sucursales,$timeout){
  var yo = this;
  $sesion.obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
      Sucursales.consulta({id:yo.usuario.id})
        .$promise.then(function(data){
          yo.sucursales = data;
        });
    });

  yo.logOut = function(){
    $auth.logout()
          .then(function() {
              // Desconectamos al usuario y lo redirijimos
              $sesion.desconectar();
              $state.go("frontPage");
          });
  };
  yo.openLeftMenu = function() {
    $mdSidenav('left').toggle();
  };
  yo.openRightMenu = function() {
    $mdSidenav('right').toggle();
  };
  yo.agregarSucursal = function(){
    console.log('sucursal');
    $state.go('proveedor.nuevaSucursal');
  }
  yo.irASucursal = function(id){
    $state.go('proveedor.sucursal',{"sucursal":id});
  }
}])