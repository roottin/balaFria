angular.module('balafria').controller('ctrlSucursal', ['$state','Sucursales','$scope','$timeout', function ($state,Sucursales,$scope,$timeout){
  var yo = this;
  yo.edit=false;
  yo.datos=null;
  yo.temp=null;
  yo.icono = "edit";

  if(!$state.params.sucursal){
    $state.go('proveedor.dashboard');
  }
  Sucursales.get({id:$state.params.sucursal},function(result){
    $timeout(function(){
      yo.datos = angular.copy(result);
      yo.temp = angular.copy(result);
      if(!result.banner){
        yo.datos.banner = {};
        yo.temp.banner = {};
      }
    });
  });
  yo.cambioBanner = function(){
    document.querySelector('input[type="file"]').click();
  }
  $scope.cambio = function(files){
    yo.temp.banner = {
      ruta:(window.URL || window.webkitURL).createObjectURL( files[0] )
    }
    document.querySelector('#banner').setAttribute('src',yo.temp.banner.ruta);
    $timeout(function(){
      yo.temp.cambio = true;
    });
  }
  yo.guardarCambios = function(){
    console.log(yo.temp);
  }
  yo.revertirCambios = function(){
    if(yo.temp.banner){
        window.URL.revokeObjectURL(document.querySelector('#banner').getAttribute('src'));
        document.querySelector('#banner').setAttribute('src',(yo.datos.banner.ruta || ""));
    }
    $timeout(function(){
      yo.temp = angular.copy(yo.datos);
      yo.temp.cambio = false;
    });
  }
  yo.editar = function(){
    var cambio = yo.temp.cambio;
    yo.temp.nombre = document.querySelector('#nombre').value;
    if(yo.datos.nombre != yo.temp.nombre){
      cambio = true;
    }
    $timeout(function(){
      yo.edit = !yo.edit;
      if(!yo.edit){
        yo.icono="edit";
      }else{
        yo.icono="close";
      }
      yo.temp.cambio = cambio;
    });
  }
}]);
