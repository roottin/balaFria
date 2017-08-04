angular.module('balafria')
.controller('ctrlNuevaSucursal', ['$state','Rubros','$http','$sesion', function ($state,Rubros,$http,$sesion){
  var yo = this;
  $sesion.obtenerPerfil()
    .then(perfil => {
      yo.usuario = perfil;
    });
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
}]);