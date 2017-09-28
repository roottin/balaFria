angular.module('balafria')
.controller('ctrlFormasDePago', ['$scope','$mdDialog', function($scope,$mdDialog) {
  var yo = this;
  yo.autorizar = function(ev,tipo){
  	console.log("llego");
  	if(tipo == "mercadoPago"){
  		$mdDialog.show({
	        controller: 'ctrlAuthTerceros',
	        controllerAs:"auth",
	        templateUrl: '/views/plantillas/auth/auth.tmpl.html',
	        parent: angular.element(document.body),
	        targetEvent: ev,
	        clickOutsideToClose:true,
	        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	    }).then(function(){
	      $scope.rubros =  Rubros.query(function(){});
	    });
  	}
  }
}])
