angular.module('balafria')
.controller('ctrlProveedor', ['$scope','$state','$mdDialog','Upload','$sesion','$mdToast', function ($scope,$state,$mdDialog,Upload,$sesion,$mdToast){
  var yo = this;
  yo.textoBoton = "envialo";
  yo.submit = function(){ //function to call on form submit
    if(yo.upload_form.$valid){
       if (yo.upload_form.file.$valid && yo.file) { //check if from is valid
          yo.upload(yo.file); //call upload function
       }else{
         console.warn('formulario archivo invalido');
         $mdToast.show(
          $mdToast.simple()
            .textContent("Por favor cargue su imagen avatar")
            .position('top right')
            .hideDelay(3000)
        );
       }
    }else{
      console.warn('formulario invalido');
      $mdToast.show(
        $mdToast.simple()
          .textContent("Llene todos los valores antes de continuar")
          .position('top right')
          .hideDelay(3000)
      );
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
       var user = {
         "nombre":resp.data.nombre,
         "documento":resp.data.documento,
         "id":resp.data.id,
         "email":resp.data.email,
         "token":resp.data.token,
         "avatar":{
           "id":resp.data.imagen.id,
           "ruta":resp.data.imagen.ruta
         }
       };
       $sesion.crear(user,'proveedor').conectar();
       $state.go('proveedor.verificarCorreo');
     }, function (resp) { //catch error
         console.log('Error status: ' + resp.status);
     }, function (evt) {
         console.log(evt);
         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
         console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
         yo.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
     });
   };
}]);