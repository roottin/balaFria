angular.module('balafria').controller('ctrlSucursal', ['$state','Sucursales','$scope','$timeout','$sesion', function ($state,Sucursales,$scope,$timeout,$sesion){
  var yo = this;
  yo.edit=false;
  yo.datos=null;
  yo.temp=null;
  yo.usuario = null;
  yo.icono = "edit";
  angular.extend($scope, {
        Acarigua: {
            lat: 9.55972,
            lng: -69.20194,
            zoom: 13
        }
    });
  yo.markers = [];
  yo.paths = {};
  yo.coordenadas = [];
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
    $sesion.obtenerPerfil()
      .then(function(result){
        yo.usuario = result;
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
  //------------------------------Mapa------------------------------------------
  yo.mapa = {
    ubicacion:{
      edit:false,
      icono:'edit'
    },
    offClick : null,
    zonasAtencion:[]
  };
  yo.agregarZona = function(){
    if(!yo.mapa.edit){
      yo.mapa.edit = true;
      yo.mapa.offClick = $scope.$on('leafletDirectiveMap.click', function(event, args) {
        var leafEvent = args.leafletEvent;
          yo.coordenadas.push({lat:leafEvent.latlng.lat,lng:leafEvent.latlng.lng});
            yo.markers = [];
            yo.paths.p1 = {
              type:"polygon",
              color: '#303030',
              weight: 2,
              latlngs: yo.coordenadas,
              message: "<h3>Route from London to Rome</h3><p>Distance: 1862km</p>"
            }
       });
    }
    else{
      yo.mapa.edit = false;
      yo.mapa.offClick();
    }
  }
  yo.agregarUbicacion = function(){
    if(!yo.mapa.ubicacion.edit){
      yo.mapa.ubicacion.edit = true;
      yo.mapa.ubicacion.icono = 'save';
      yo.mapa.offClick = $scope.$on('leafletDirectiveMap.click', function(event, args) {
        var leafEvent = args.leafletEvent;
        yo.markers=[];
        yo.markers.push({
          lat: leafEvent.latlng.lat,
          lng: leafEvent.latlng.lng,
          message: "Estas Aqui"
        });
      });
    }
    else{
      yo.mapa.ubicacion.edit = false;
      yo.mapa.ubicacion.icono = 'edit';
      yo.mapa.offClick();
    }
  }

}]);
