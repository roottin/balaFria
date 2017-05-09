angular.module('balafria')
.controller('ctrlMap', ['$scope','Rubros', function ($scope,Rubros) {
  angular.extend($scope, {
        Acarigua: {
            lat: 9.55972,
            lng: -69.20194,
            zoom: 13
        }
    });
  $scope.rubros = Rubros.query(function(){
    console.log($scope.rubros);
  });
  $scope.disponibles = [];
  $scope.openMenu = function($mdMenu, ev) {
    originatorEv = ev;
    $mdMenu.open(ev);
  };
  $scope.toggleRubro = function($index){
    console.log($scope.disponibles.indexOf($scope.rubros[$index]));
    if($scope.disponibles.indexOf($scope.rubros[$index]) === -1){
      $scope.disponibles.push($scope.rubros[$index]);
    }else{
      $scope.disponibles.splice($scope.disponibles.indexOf($scope.rubros[$index]),1);
    }
  };
}])
.controller('ctrlHeaderCli', ['$state','$sesion','$auth', function ($state,$sesion,$auth){
  var yo = this;
  yo.usuario = $sesion.perfil;
  yo.logOut = function(){
    $auth.logout()
          .then(function() {
              // Desconectamos al usuario y lo redirijimos
              $sesion.desconectar();
              $state.go("frontPage");
          });
  };
}]);
