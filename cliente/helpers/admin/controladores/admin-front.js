angular.module('balafria')
.controller('ctrlAdmin', ['$scope','$state', function ($scope,$state) {

}])
.controller('ctrlAdminLog', ['$scope','$http','$state','$sesion', function ($scope,$http,$state,$sesion) {
  $scope.login = function(){
    $http.post('/api/autenticarAdmin',{
      "usuario":$scope.usuario,
      "clave":$scope.clave
    })
      .success(function(data,status){
        if(data.success){
          $sesion.crear(data.user,'admin').conectar();
          $state.go('admin.landing');
        }else{
          alert('contraseña erronea');
        }
      });
  };
}])
.controller('ctrlHora', ['$scope','$interval',function ($s,$i){
  $s.fechaHora = new Date();
}])
.controller('ctrlLandAdmin', ['$http','$scope','$sesion','$adminPanel',function ($http,$scope,$sesion,$adminPanel) {
  $scope.usuario = $sesion.perfil;

  $adminPanel.getClientes($http,$scope);
  $adminPanel.getProveedores($http,$scope);

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
}]);
