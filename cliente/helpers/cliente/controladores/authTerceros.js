angular.module('balafria')
.controller('ctrlAuthTerceros', ['$mdToast','$http','$state','$sesion','$mdDialog', function($mdToast,$http,$state,$sesion,$mdDialog) {
  var yo = this;
  yo.client_id = 876974982983815;
  yo.url="https://auth.mercadopago.com.ve/authorization?client_id="+yo.client_id+
  				"&response_type=code"+
  				"&platform_id=mp&"+
  				"redirect_uri=localhost"
  $sesion
    .obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
    });
     
  yo.hide = function() {
      $mdDialog.hide();
  };
}])
