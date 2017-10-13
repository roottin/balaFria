angular.module('balafria')
.controller('ctrlSeguridad', ['$scope', function($scope) {
  var yo = this;
  $scope.titulo = "este es el titulo";
  $scope.nombre ="";
  $scope.especie ="";
  $scope.animales = [];
  $scope.agregar = function(){
    if($scope.especie){
      $scope.animales.push({
        nombre : $scope.nombre,
        especie: $scope.especie
      });
      $scope.especie = "";
      $scope.nombre ="";
    }
  };
}])
