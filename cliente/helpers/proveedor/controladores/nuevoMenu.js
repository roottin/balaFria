angular.module('balafria')
.controller('ctrlAddMenu', ['$mdDialog','$http','$sesion','$mdToast','Menu', function ($mdDialog,$http,$sesion,$mdToast,Menu){
  var yo = this;
  $sesion
    .obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
    })
  //fin contacto
  yo.submit = function(){
    if(yo.formulario.$valid){
      var data ={
        nombre: yo.formulario.nombre.$viewValue,
        descripcion: yo.formulario.descripcion.$viewValue,
        id_proveedor: yo.usuario.id
      }
      $http
        .post('/api/menus',data)
        .then(function(result){
          $mdDialog.hide(result.data);
        });
    }else{
      $mdToast.show(
          $mdToast.simple()
            .textContent("Llene todos los campos anter de continuar")
            .position('top right')
            .hideDelay(3000)
        );
    }
  };
  yo.cancel = function() {
      $mdDialog.hide();
  };
}])