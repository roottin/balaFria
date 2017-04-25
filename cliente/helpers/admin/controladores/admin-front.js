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
.controller('ctrlLandAdmin', ['$scope','$sesion', function ($scope,$sesion) {
  $scope.usuario = $sesion.perfil;
}]);
