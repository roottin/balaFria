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
}]);
