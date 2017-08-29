angular.module('balafria')
.controller('ctrlBucarProductos', ['$mdDialog','$http','$sesion','$mdToast','Productos','$state',"categoriaPadre" ,function ($mdDialog,$http,$sesion,$mdToast,Productos,$state,categoriaPadre){
  var yo = this;
  $sesion
    .obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
      Productos.consulta({id_proveedor:yo.usuario.id,id_detalle_menu:categoriaPadre.id_detalle_menu})
        .$promise.then(function(data){
          yo.lista = data;
        });
    })
    yo.usar = function(producto){
      var data = {
        id_producto: producto.id_producto,
        id_detalle_menu: categoriaPadre.id_detalle_menu
      }
      $http
        .put('/api/menus/cambiarProducto/',data)
        .then(function(){
          $mdDialog.hide(producto);
        })
    }
  yo.cancel = function() {
      $mdDialog.hide();
  };
}]);
