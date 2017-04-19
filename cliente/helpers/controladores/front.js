angular.module('balafria')
.controller('ctrlFront', ['$scope','$state', function ($scope,$state) {
  $state.go('frontPage.main');
}])
.controller('ctrlMap', ['$scope','Rubros', function ($scope,Rubros) {
  angular.extend($scope, {
        Acarigua: {
            lat: 9.55972,
            lng: -69.20194,
            zoom: 13
        }
    });
  $scope.rubros = Rubros.query(function(){
  	
  });
}]);
