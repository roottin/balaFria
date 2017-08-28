angular.module('balafria')
.controller('ctrlNuevaSucursal', ['Paises','Ciudades','$scope','$state','Rubros','$http','$sesion', function (Paises,Ciudades,$scope,$state,Rubros,$http,$sesion){
  var yo = this;
  yo.ciudadesAct =[];
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
    yo.data.id_ciudad = yo.ciudad;
    if(yo.data.rubros.length){
      if(yo.data.tipo){
        $http.post('/api/sucursal',yo.data)
          .then(function(respuesta){
            $state.go('proveedor.sucursal',{"sucursal":respuesta.data.id_sucursal});
          });
      }
    }
  }
}]);