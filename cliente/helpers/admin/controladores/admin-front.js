angular.module('balafria')
.controller('ctrlAdmin', ['$scope','$state', function ($scope,$state) {

}])
.controller('ctrlAdminLog', ['$scope','$http', function ($scope,$http) {
  $scope.login = function(){
    $http.post('/api/autenticarAdmin',{
      "usuario":$scope.usuario,
      "clave":$scope.clave
    })
      .success(function(data,status){
        console.log(data);
      });
  };
}]);
