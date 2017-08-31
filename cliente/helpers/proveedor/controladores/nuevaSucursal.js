angular.module('balafria')
.controller('ctrlNuevaSucursal', ['Paises','Ciudades','$scope','$state','Rubros','$http','$sesion','$mdToast', function (Paises,Ciudades,$scope,$state,Rubros,$http,$sesion,$mdToast){
  var yo = this;
  yo.ciudadesAct =[];
  yo.centro = {
          lat: 31.353636941500987,
          lng: -41.66015625000001,
          zoom: 2
  };
  yo.markers = [];
  $sesion.obtenerPerfil()
    .then(perfil => {
      yo.usuario = perfil;
    });
  Paises
    .query()
    .$promise
    .then(function(paises){
      yo.paises = paises
    })
  Ciudades
    .query()
    .$promise
    .then(function(ciudades){
      yo.ciudades = ciudades;
    })
   yo.rubros = Rubros.query(function(){});
   yo.data = {
     "rubros":[]
   };
  $scope.$watch(function(scope) { return yo.pais },
    function(newValue, oldValue) {
        if(newValue){
          yo.ciudadesAct = [];
          yo.ciudades.forEach(function(ciudad){
            if(ciudad.id_pais == newValue){
              yo.ciudadesAct.push(ciudad);
            }
          });
        }
    }
   );
  $scope.$watch(function(scope) { return yo.ciudad },
      function(newValue, oldValue) {
          yo.asignarCiudad(newValue);
      }
     );
   $scope.$on('leafletDirectiveMap.click', function(event, args) {
         var leafEvent = args.leafletEvent;
         yo.markers=[];
         yo.markers.push({
           lat: leafEvent.latlng.lat,
           lng: leafEvent.latlng.lng,
           message: "Estas Aqui"
         });
         yo.latlng = leafEvent.latlng;
       });
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
  yo.asignarCiudad = function(id){
    if(id){
      yo.ciudades.forEach(function(ciudad){
        if(ciudad.id_ciudad == id){
          yo.paises.forEach(function(pais){
            if(pais.id_pais == ciudad.id_pais){
              yo.centro = {
                lat:ciudad.latlng.lat,
                lng:ciudad.latlng.lng,
                zoom:parseInt(ciudad.zoom)
              }
            }
          });
        }
      });
    }
  }
  yo.submit = function(){
    var guardar = false;
    if(yo.data.rubros.length){
      guardar = true;
      if(yo.tipo){
        if(yo.tipo == 'F' && yo.latlng){
          
        }else{
          guardar = false;
          $mdToast.show(
            $mdToast.simple()
              .textContent("Eliga una ubicacion para la sucursal")
              .position('top right')
              .hideDelay(3000)
          );
        }
        if(!yo.ciudad){
          guardar = false;
          $mdToast.show(
            $mdToast.simple()
              .textContent("Eliga el pais y la ciudad a la que pertenece esa sucursal")
              .position('top right')
              .hideDelay(3000)
          );
        }
      }else{
        guardar = false;
        $mdToast.show(
            $mdToast.simple()
              .textContent("Eliga un tipo de sucursal")
              .position('top right')
              .hideDelay(3000)
          );
      }
    }else{
      $mdToast.show(
        $mdToast.simple()
          .textContent("Debe Seleccionar al menos un Rubro antes de guardar")
          .position('top right')
          .hideDelay(3000)
      );
    }
    if(guardar){
      yo.data.tipo = yo.tipo;
      yo.data.nombre = yo.nombre;
      yo.data.id_proveedor = yo.usuario.id;
      yo.data.id_ciudad = yo.ciudad;
      yo.data.latlng = yo.latlng;
      $http.post('/api/sucursal',yo.data)
         .then(function(respuesta){
          $state.go('proveedor.sucursal',{"sucursal":respuesta.data.id_sucursal});
         });
    }
  }
}]);
