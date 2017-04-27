angular.module('balafria')
.controller('ctrlAdmin', ['$scope','$state', function ($scope,$state) {

}])
.controller('ctrlAdminLog', ['$scope','$http','$state','$sesion','$auth', function ($scope,$http,$state,$sesion,$auth) {
  $scope.login = function(){
        $auth.login({
            "nombre": $scope.usuario,
            "clave": $scope.clave,
            "tipo": "admin"
        })
        .then(function(response) {
          $sesion.crear(response.data.user,'admin').conectar();
          $state.go('admin.landing');
        })
        .catch(function(response) {
            // Si ha habido errores, llegaremos a esta función
            console.error(new Error(response));
        });
    };
}])
.controller('ctrlLandAdmin', ['$http','$scope','$sesion','$adminPanel','$auth','$location','Rubros','$mdDialog',function ($http,$scope,$sesion,$adminPanel,$auth,$location,Rubros,$mdDialog) {
  $scope.usuario = $sesion.perfil;

  $adminPanel.getClientes($http,$scope);
  $adminPanel.getProveedores($http,$scope);

  //Rubros
  $scope.rubros = Rubros.query(function(){});
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

  $sesion.on('notificacion',function(data){
    switch (data.tipo) {
      case "clientes":
        switch (data.motivo) {
          case 'registrados':
            $scope.clientes.registrados = data.cantidad;
            break;
        }
        break;
      case "proveedores":
        switch (data.motivo) {
          case 'registrados':
            $scope.proveedores.registrados = data.cantidad;
            break;
        }
        break;
    }
  });
  //cierre de sesion
  $scope.logOut = function(){
    console.log("entro");
    $auth.logout()
          .then(function() {
              // Desconectamos al usuario y lo redirijimos
              $sesion.desconectar();
              $location.path("/admin");
          });
  };
}]);
