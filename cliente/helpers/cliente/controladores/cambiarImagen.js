angular.module('balafria')
.controller('ctrlCambiarImg', ['$mdToast','$http','$state','$sesion','$auth','$mdDialog','Upload', function($mdToast,$http,$state,$sesion,$auth,$mdDialog,Upload) {
  var yo = this;
  $sesion
    .obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
    });
     yo.submit = function(){ //function to call on form submit
       if(yo.usuario){
         if (yo.upload_form.file.$valid && yo.file) { //check if from is valid
             yo.upload(yo.file); //call upload function
         }
       }else{
         $mdToast.show(
           $mdToast.simple()
             .textContent("Cargando datos de usuario")
             .position('top right')
             .hideDelay(3000)
         );
       }
     };
     yo.upload = function (file) {
         Upload.upload({
             url: '/api/cliente/avatar',
             data:{
               file:file,
               id_cliente:yo.usuario.id
             }
         }).then(function (resp) { //upload function returns a promise
             $mdDialog.hide(resp);
         }, function (resp) { //catch error
           $mdToast.show(
             $mdToast.simple()
               .textContent('Error status: ' + resp.status)
               .position('top right')
               .hideDelay(3000)
           );
         }, function (evt) {
             var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
             console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
         });
     };
     yo.hide = function() {
         $mdDialog.hide();
     };
}])
