angular.module('balafria')
.controller('ctrlBucarCategorias', ['$mdDialog','$http','$sesion','$mdToast','Categorias','$state' ,function ($mdDialog,$http,$sesion,$mdToast,Categorias,$state){
  var yo = this;
  $sesion
    .obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
      Categorias.consulta({id_proveedor:yo.usuario.id,id_sucursal:$state.params.sucursal})
        .$promise.then(function(data){
          yo.lista = data;
        });
    })
    yo.elegir = function(index){
      var data = {
        id_categoria: yo.lista[index].id_categoria,
        id_sucursal: $state.params.sucursal
      }
      $http
        .put('/api/menus/cambiarCategoria/',data)
        .then(function(){
          $mdDialog.hide(yo.lista[index]);
        })
    }
  yo.cancel = function() {
      $mdDialog.hide();
  };
}]);
