angular.module('sketch')
.controller('ctrlFront', ['$scope','$state', function ($scope,$state) {
  $state.go('frontPage.main');
}]);
