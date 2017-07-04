angular.module('balafria')
.controller('ctrlLandAdmin', ['$http','$scope','$sesion','$adminPanel','$auth','$location','Rubros','$mdDialog','TipoImagen',
  function ($http,$scope,$sesion,$adminPanel,$auth,$location,Rubros,$mdDialog,TipoImagen) {
  $scope.usuario = $sesion.obtenerPerfil();
  $adminPanel.getClientes($http,$scope);
  $adminPanel.getProveedores($http,$scope);

  //Rubros
  $scope.rubros = Rubros.query(function(){});
  $scope.tipos_imagen = TipoImagen.query(function(){});
  $scope.showAdvanced = function(ev) {
      $mdDialog.show({
        controller: 'ctrlRubro',
        controllerAs:"up",
        templateUrl: '/views/plantillas/admin/rubro.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    }).then(function(){
      $scope.rubros =  Rubros.query(function(){});
    });
  };

  $scope.showTipoImagen = function(ev) {
      $mdDialog.show({
        controller: 'ctrlTipoImagen',
        controllerAs:"up",
        templateUrl: '/views/plantillas/admin/tipoImagen.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    }).then(function(){
      $scope.tipos_imagen =  TipoImagen.query(function(){});
    });
  };

  $sesion.on('notificacion',function(data){
    console.log("informacion recivida via socket:",data);
    switch (data.tipo) {
      case "cliente":
        switch (data.motivo) {
          case 'registrados':
            $scope.clientes.registrados = data.cantidad;
            break;
          case 'conexion':
            $scope.clientes.usuarios.push(data.perfil);
            $scope.clientes.conectados++;
            break;
          case 'desconexion':
            $scope.clientes.usuarios.splice($scope.clientes.usuarios.indexOf(data.perfil),1);
            $scope.clientes.conectados--;
            break;
        }
        break;
      case "proveedor":
        switch (data.motivo) {
          case 'registrados':
            $scope.proveedores.registrados = data.cantidad;
            break;
          case 'conexion':
            $scope.proveedores.usuarios.push(data.perfil);
            $scope.proveedores.conectados++;
            break;
          case 'desconexion':
            $scope.proveedores.usuarios.splice($scope.proveedores.usuarios.indexOf(data.perfil),1);
            $scope.proveedores.conectados--;
            break;
        }
        break;
    }
  });
  //cierre de sesion
  $scope.logOut = function(){
    $auth.logout()
          .then(function() {
              // Desconectamos al usuario y lo redirijimos
              $sesion.desconectar();
              $location.path("/cliente");
          });
  };
}]);
