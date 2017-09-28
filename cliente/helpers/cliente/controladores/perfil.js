angular.module('balafria')
.controller('ctrlPerfil', ['$scope',"$sesion", function($scope,$sesion) {
  var yo = this;
  $sesion.obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
    })
    .catch(function(error){
      yo.usuario = null;
    });
}])
