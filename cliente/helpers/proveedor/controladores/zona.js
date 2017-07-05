angular.module('balafria')
.controller('ctrlZona', ['$mdDialog', function ($mdDialog){
  var yo = this;
  yo.submit = function(){
    $mdDialog.hide(yo.zona);
  };
  yo.cancel = function() {
      $mdDialog.hide();
  };
}]);
