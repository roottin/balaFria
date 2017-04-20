angular.module('balafria')
.controller('ctrlRubro', ['Upload','$mdToast', function( Upload,$mdToast) {

 var vm = this;
    vm.submit = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    };
    vm.upload = function (file) {
        Upload.upload({
            url: '/api/rubros', //webAPI exposed to upload the file
            data:{
              file:file,
              nombre:vm.nombre,
              color:vm.color,
              descripcion:vm.descripcion
            }
        }).then(function (resp) { //upload function returns a promise
            vm.nombre = "";
            vm.descripcion = "";
            vm.file = "";
            vm.color = "";
            $mdToast.showSimple('Hello');
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);
