angular.module('balafria')
.controller('ctrlCambiarImg', ['$http','$state','$sesion','$auth','$mdDialog','Upload', function($http,$state,$sesion,$auth,$mdDialog,Upload) {
  var yo = this;
  yo.usuario=$sesion.obtenerPerfil();
     yo.submit = function(){ //function to call on form submit
         if (yo.upload_form.file.$valid && yo.file) { //check if from is valid
             yo.upload(yo.file); //call upload function
         }
     };
     yo.upload = function (file) {
         Upload.upload({
             url: '/api/cliente/avatar',
             data:{
               file:file,
               "id_cliente":yo.usuario.id
             }
         }).then(function (resp) { //upload function returns a promise
             $mdDialog.hide(resp);
         }, function (resp) { //catch error
             console.log('Error status: ' + resp.status);
             $window.alert('Error status: ' + resp.status);
         }, function (evt) {
             var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
             console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
         });
     };
     yo.hide = function() {
         $mdDialog.hide();
     };
}])
