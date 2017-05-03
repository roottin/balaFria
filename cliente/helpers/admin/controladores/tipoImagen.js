angular.module('balafria')
.controller('ctrlTipoImagen', ['TipoImagen','$mdToast','$mdDialog', function( TipoImagen,$mdToast,$mdDialog) {

 var vm = this;
 vm.tipoImagen = new TipoImagen();
    vm.submit = function(){ //function to call on form submit
        if (vm.upload_form.$valid) { //check if from is valid
            vm.tipoImagen.$save(function(resultado){
                $mdDialog.hide(resultado);
            });
        }
    };
    vm.cancel = function() {
        $mdDialog.hide();
    };
}]);
