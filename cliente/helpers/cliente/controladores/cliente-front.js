angular.module('balafria')
.controller('ctrlMap', ['$scope','Rubros','Sucursales','$rootScope', function ($scope,Rubros,Sucursales,$rootScope) {
  angular.extend($rootScope, {
        Acarigua: {
            lat: 9.55972,
            lng: -69.20194,
            zoom: 13
        }
    });
  Rubros
    .query(function(){ })
    .$promise
    .then(function(result){
        $scope.rubros = result;
    });
  Sucursales
    .buscar()
    .$promise
    .then(function(result){
      console.log(result);
      $scope.sucursales = result;
    })
  $scope.disponibles = [];
  $scope.openMenu = function($mdMenu, ev) {
    originatorEv = ev;
    $mdMenu.open(ev);
  };
  $scope.toggleRubro = function($index){
    console.log($scope.disponibles.indexOf($scope.rubros[$index]));
    if($scope.disponibles.indexOf($scope.rubros[$index]) === -1){
      $scope.disponibles.push($scope.rubros[$index]);
    }else{
      $scope.disponibles.splice($scope.disponibles.indexOf($scope.rubros[$index]),1);
    }
  };
}])
.controller('ctrlHeaderCli', ['$state','$sesion','$auth','$mdDialog','$http', function ($state,$sesion,$auth,$mdDialog,$http){
  var yo = this;
  yo.usuario = $sesion.obtenerPerfil();
  yo.logOut = function(){
    $auth.logout()
          .then(function() {
              // Desconectamos al usuario y lo redirijimos
              $sesion.desconectar();
              $state.go("frontPage");
          });
  };
  yo.cambiarImagen = function(ev){
    $mdDialog.show({
      controller: 'ctrlCambiarImg',
      controllerAs: 'form',
      templateUrl: '/views/plantillas/cliente/cambiarImagen.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    }).then(function(cambio){
      if(cambio){
        yo.usuario = $sesion.actualizarDatos($http);
      }
    });
  }
}])
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
}]);
