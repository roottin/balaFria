angular.module('balafria')
.controller('ctrlLogPro', ['$scope','$http','$state','$sesion','$auth','$mdToast', function ($scope,$http,$state,$sesion,$auth,$mdToast) {
  $scope.login = function(){
        $auth.login({
            "field": $scope.field,
            "clave": $scope.clave,
            "tipo": "proveedor"
        })
        .then(function(response) {
          if(response.data.success){
            $sesion.crear(response.data.user,'proveedor').conectar();
            $state.go('proveedor.dashboard');
          }else{
            $mdToast.show(
              $mdToast.simple()
                .textContent("Error de Autenticacion")
                .position('top right')
                .hideDelay(3000)
            );
          }
        })
        .catch(function(response) {
            // Si ha habido errores, llegaremos a esta función
            console.error(new Error(response));
        });
    };
}]);
