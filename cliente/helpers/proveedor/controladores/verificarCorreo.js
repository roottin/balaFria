angular.module('balafria')
.controller('ctrlCorreo', ['$state','$sesion', function ($state,$sesion){
  var yo = this;
  $sesion.obtenerPerfil()
  	.then(function(perfil){
  		yo.usuario = perfil;
  	});
}])