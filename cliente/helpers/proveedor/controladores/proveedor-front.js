angular.module('balafria')
.controller('ctrlProveedor', ['$scope','$state','$mdDialog','Upload', function ($scope,$state,$mdDialog,Upload){
  var yo = this;
  yo.textoBoton = "envialo";
  yo.submit = function(){ //function to call on form submit
    if(yo.upload_form.$valid){
       if (yo.upload_form.file.$valid && yo.file) { //check if from is valid
          yo.upload(yo.file); //call upload function
       }else{
         console.warn('formulario archivo invalido');
       }
    }else{
      console.warn('formulario invalido');
    }
  };
  yo.upload = function (file) {
     Upload.upload({
         url: '/api/proveedor',
         data:{
           file:file,
           nombre:yo.nombre,
           documento:yo.rif,
           email:yo.email,
           clave:yo.clave
         }
     }).then(function (resp) { //upload function returns a promise
       $mdDialog.show({
         templateUrl: '/views/plantillas/proveedor/registroExitoso.tmpl.html',
         parent: angular.element(document.body),
         clickOutsideToClose:true,
         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
     }, function (resp) { //catch error
         console.log('Error status: ' + resp.status);
         $window.alert('Error status: ' + resp.status);
     }, function (evt) {
         console.log(evt);
         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
         console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
         yo.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
     });
   });
 };
}]);
