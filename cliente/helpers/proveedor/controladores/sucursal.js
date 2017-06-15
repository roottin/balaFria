angular.module('balafria')
.controller('ctrlSucursal', ['$state','Sucursales','$scope','$timeout','$sesion','$mdDialog', function ($state,Sucursales,$scope,$timeout,$sesion,$mdDialog){
  var yo = this;

  if(!$state.params.sucursal){
    $state.go('proveedor.dashboard');
  }
  //variables principales
  yo.SUID = 0; //Secuencia UID de objetos creados temporalmente
  yo.edit=false;
  yo.datos = null;
  yo.temp = {};
  yo.usuario = null;
  yo.icono = "edit";
  yo.paths = [];
  Sucursales.get({id:$state.params.sucursal},function(result){
    $timeout(function(){
      yo.datos = angular.copy(result);
      yo.temp = completarTemp(result);
      yo.inicializarTemp();
    });
    $sesion.obtenerPerfil()
      .then(function(result){
        yo.usuario = result;
      });
  });
  //fin declaracion de variables
  yo.inicializarTemp = function(){
    var temp = yo.temp;
    //cambio
    temp.cambio = false;
    //luego paths
    temp.zonasAtencion.forEach(function(zona){
      zona.icono = "edit";
      var path = crearPath(zona);
      yo.paths.push(path);
    });
    //ubicacion
    temp.ubicacion.edit = false;
    temp.ubicacion.icono = 'edit';
    if(temp.ubicacion.lat){
      temp.markers.push({
        lat: temp.ubicacion.lat,
        lng: temp.ubicacion.lng,
        message: "Estas Aqui"
      });
    }
  }
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
        var ruta = "";
        if(yo.datos.banner){
          ruta = yo.datos.banner.ruta;
        }
        document.querySelector('#banner').setAttribute('src',ruta);
    }
    $timeout(function(){
      yo.temp = completarTemp(yo.datos);
      yo.inicializarTemp();
      yo.temp.cambio = false;
      yo.paths = [];
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
  angular.extend($scope, {
        Acarigua: {
            lat: 9.55972,
            lng: -69.20194,
            zoom: 13
        }
    });
  yo.mapa = {
    coordenadas: [],
    offClick : null
  };
  yo.buscarPath = function(zona){
    var resultado = false;
    yo.paths.forEach(function(path){
      if(path.id===zona.id){
        resultado = path;
      }
    });
    return resultado;
  };
  yo.modificarZona = function(zona){
    if(zona.icono === "edit"){
      var path = yo.buscarPath(zona);
      zona.icono = "save";
      zona.clase = "pulse";
      yo.mapa.offClick = $scope.$on('leafletDirectiveMap.click', function(event, args) {
        var leafEvent = args.leafletEvent;
          yo.mapa.coordenadas.push({lat:leafEvent.latlng.lat,lng:leafEvent.latlng.lng});
          path.latlngs = [];
          path.latlngs=yo.mapa.coordenadas;
       });
    }else{
      zona.icono = "edit";
      zona.clase = "";
      yo.mapa.offClick();
      yo.mapa.coordenadas = [];
    }
  }
  yo.agregarZona = function(ev){
    $mdDialog.show({
      controller: 'ctrlZona',
      controllerAs: 'form',
      templateUrl: '/views/plantillas/proveedor/agregarZona.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    }).then(function(datos){
      datos.id = "new"+yo.SUID++;
      var path = crearPath(datos);
      datos.icono = "edit";
      yo.paths.push(path);
      yo.temp.zonasAtencion.push(datos);
    });
  }
  yo.agregarUbicacion = function(){
    if(!yo.temp.ubicacion.edit){
      yo.temp.ubicacion.edit = true;
      yo.temp.ubicacion.icono = 'save';
      yo.temp.ubicacion.clase = 'pulse';
      yo.mapa.offClick = $scope.$on('leafletDirectiveMap.click', function(event, args) {
        var leafEvent = args.leafletEvent;
        yo.temp.markers=[];
        yo.temp.markers.push({
          lat: leafEvent.latlng.lat,
          lng: leafEvent.latlng.lng,
          message: "Estas Aqui"
        });
      });
    }
    else{
      yo.temp.ubicacion.edit = false;
      yo.temp.ubicacion.icono = 'edit';
      yo.temp.ubicacion.clase = '';
      yo.mapa.offClick();
    }
  }
}]);
function completarTemp(datos){
  var temp = angular.copy(datos);
  //inicializacion de propiedades faltantes
  var propiedades = [
    {"nombre":"banner","tipo":"objeto"},
    {"nombre":"zonasAtencion","tipo":"arreglo"},
    {"nombre":"paths","tipo":"arreglo"},
    {"nombre":"markers","tipo":"arreglo"},
    {"nombre":"ubicacion","tipo":"objeto"}
  ];
  propiedades.forEach(function(propiedad){
    if(!temp.hasOwnProperty(propiedad.nombre)){
      if(propiedad.tipo === "arreglo"){
        temp[propiedad.nombre] = [];
      }else if(propiedad.tipo === "objeto"){
        temp[propiedad.nombre] = {};
      }
    }
  });
  return temp;
}
function crearPath(datos){
  var path = {
    id:datos.id,
    type:"polygon",
    color: '#303030',
    weight: 2,
    latlngs:[],
    message: "<h3>"+datos.nombre+"</h3><p>"+datos.descripcion+"</p>"
  }
  return path;
}
