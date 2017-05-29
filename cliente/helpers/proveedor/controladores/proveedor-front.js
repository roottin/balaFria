angular.module('balafria')
.controller('ctrlProveedor', ['$scope','$state','$mdDialog','Upload','$sesion', function ($scope,$state,$mdDialog,Upload,$sesion){
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
}])
.controller('ctrlCorreo', ['$state','$sesion', function ($state,$sesion){
  var yo = this;
  yo.usuario = $sesion.obtenerPerfil();
}])
.controller('ctrlNuevaSucursal', ['$state','Rubros','$http','$sesion', function ($state,Rubros,$http,$sesion){
  var yo = this;
  yo.usuario = $sesion.obtenerPerfil();
  yo.rubros = Rubros.query(function(){});
  yo.data = {
    "rubros":[]
  };
  yo.toggleRubro = function(indice){
    var rubro = yo.rubros[indice];
    if(yo.data.rubros.indexOf(rubro) == -1){
      yo.data.rubros.push(rubro);
      rubro.clase = "activo";
    }else{
      yo.data.rubros.splice(yo.data.rubros.indexOf(rubro),1);
      rubro.clase = "";
    }
  };
  yo.submit = function(){
    yo.data.tipo = yo.radio;
    yo.data.nombre = yo.nombre;
    yo.data.id_proveedor = yo.usuario.id;
    if(yo.data.rubros.length){
      if(yo.data.tipo){
        $http.post('/api/sucursal',yo.data)
          .then(function(respuesta){
            $state.go('proveedor.sucursal',{"sucursal":respuesta.data.id_sucursal});
          });
      }
    }
  }
}])
.controller('ctrlHeaderPro', ['$state','$sesion','$auth','$mdSidenav','Sucursales', function ($state,$sesion,$auth, $mdSidenav,Sucursales){
  var yo = this;
  $sesion.obtenerPerfil()
    .then(function(perfil){
      yo.usuario = perfil;
      yo.sucursales = [Sucursales.consulta({id:yo.usuario.id})];
    });

  yo.logOut = function(){
    $auth.logout()
          .then(function() {
              // Desconectamos al usuario y lo redirijimos
              $sesion.desconectar();
              $state.go("frontPage");
          });
  };
  yo.openLeftMenu = function() {
    $mdSidenav('left').toggle();
  };
  yo.openRightMenu = function() {
    $mdSidenav('right').toggle();
  };
  yo.agregarSucursal = function(){
    console.log('sucursal');
    $state.go('proveedor.nuevaSucursal');
  }
  yo.irASucursal = function(id){
    $state.go('proveedor.sucursal',{"sucursal":id});
  }
}])
.controller('ctrlLogPro', ['$scope','$http','$state','$sesion','$auth','$mdToast', function ($scope,$http,$state,$sesion,$auth,$mdToast) {
  $scope.login = function(){
        $auth.login({
            "field": $scope.field,
            "clave": $scope.clave,
            "tipo": "proveedor"
        })
        .then(function(response) {
          if(response.data.success){
            $sesion.crear(response.data.user,'proveedor').conectar();
            $state.go('proveedor.dashboard');
          }else{
            $mdToast.show(
              $mdToast.simple()
                .textContent("Error de Autenticacion")
                .position('top right')
                .hideDelay(3000)
            );
          }
        })
        .catch(function(response) {
            // Si ha habido errores, llegaremos a esta función
            console.error(new Error(response));
        });
    };
}])
.controller('ctrlSucursal', ['$state','Sucursales','$scope', function ($state,Sucursales,$scope){
  var yo = this;
  yo.temp = {
    "banner":{
      "ruta":null
    }
  };
  if(!$state.params.sucursal){
    $state.go('proveedor.dashboard');
  }
  yo.datos = Sucursales.get({id:$state.params.sucursal},function(){
    if(yo.datos.banner){
      yo.temp.banner = yo.datos.banner;
    }
  });
  yo.cambioBanner = function(){
    document.querySelector('input[type="file"]').click();
  }
  $scope.cambio = function(files){
    yo.temp.banner = {
      ruta:(window.URL || window.webkitURL).createObjectURL( files[0] )
    }
    document.querySelector('#banner').setAttribute('src',yo.temp.banner.ruta);
  }
}]);
