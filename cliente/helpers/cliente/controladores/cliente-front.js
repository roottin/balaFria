angular.module('balafria')
.controller('ctrlMap', ['leafletData','$sesion','$scope','Rubros','Sucursales','$rootScope','$state', function (leafletData,$sesion,$scope,Rubros,Sucursales,$rootScope,$state) {
  //declaracion de variables
  $scope.disponibles = [];
  $scope.rubros = [];
  $scope.Sucursales = [];
  $scope.markers = [];
  $scope.clase="sin-logear";
  //optencion de datos
  angular.extend($rootScope, {
        Acarigua: {
            lat: 9.55972,
            lng: -69.20194,
            zoom: 13
        }
    });
  leafletData
    .getMap()
    .then(function(map){
      $scope.map = map;
    })
  Rubros
    .query(function(){ })
    .$promise
    .then(function(result){
        $scope.rubros = result;
    });
  $sesion
    .obtenerPerfil()
    .then(function(perfil){
      $scope.usuario = perfil;
      $scope.clase="logeado";
    })
    .catch(function(error){
      $scope.usuario = null;
    });
  $scope.buscarSucursales = function(){
    Sucursales
      .buscar()
      .$promise
      .then(function(result){
        $scope.sucursales = $scope.organizarLista(result);
        $scope.vistaLista();
        $scope.ubicarSucursales();
      });
  }
  $scope.buscarSucursalesRubro = function(rubro){
    Sucursales
      .buscarPorRubro({id:rubro.id_rubro})
      .$promise
      .then(function(result){
        $scope.sucursales = [];
        $scope.sucursales = $scope.organizarLista(result);
        $scope.vistaLista();
        $scope.ubicarSucursales();
      })
  };
  //------------------ disparado de Eventos ---------------------------------
  $scope.$on('inicio sesion',function(event,args){
    $sesion.obtenerPerfil()
      .then(function(perfil){
        $scope.usuario = perfil;
        $scope.clase="logeado";
      })
  });
  $scope.$on('sesion finalizada',function(event,args){
    $scope.usuario = null;
    $scope.clase="sin-logear";
  });
//------------------ Maenjo de UI ---------------------------------
  $scope.ubicarSucursales = function(){
    $scope
      .removeAllMarkers()
      .then(function(){
        $scope.sucursales.forEach(function(letra){
          letra.sucursales.forEach(function(sucursal){
            if(sucursal.id_coordenada){
              $scope.addMark(
                "<div class='marker'>"+
                  "<img src='"+sucursal.ruta+"'>"+
                "</div>"
                ,{lat:sucursal.latitud,lng:sucursal.longitud}
              );
            }
          });
        });
      });
  }
  $scope.addMark = function(html,latLng){
    var markerLocation = new L.LatLng(latLng.lat, latLng.lng);
    var helloLondonHtmlIcon = new L.HtmlIcon({
        "html" : html
    });
    var marker = new L.Marker(markerLocation, {icon: helloLondonHtmlIcon});
    $scope.markers.push(marker);
    $scope.map.addLayer(marker);
  };
  $scope.removeMArker = function(marker){
    return new Promise(function(resolve, reject) {
      $scope.map.removeLayer(marker);
      resolve(true);
    });
  }
  $scope.removeAllMarkers = function(){
      return Promise.all($scope.markers.map(function(marker){
                return $scope.map.removeLayer(marker);
              }))
  };
  $scope.verSucursal = function(sucursal){
    var id = sucursal.id_sucursal;
    $state.go('cliente.sucursal',{"sucursal":id});
  }
  $scope.organizarLista = function(result){
    $scope.letras = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('').map(function(letra){
      return {"letra":letra,"sucursales":[],"estado":"inactiva"};
    });
    var sucursales = [];
    result.forEach(function(sucursal){
      $scope.letras.forEach(function(letra){
        if (sucursal.nombre.substr(0,1).toUpperCase() === letra.letra) {
          letra.estado = "activa";
          letra.sucursales.push(sucursal);
        }
      });
    });
    $scope.letrasBusq = $scope.letras;
    $scope.letras.forEach(function(letra){
      if(letra.sucursales.length){
        sucursales.push(letra);
      }
    });
    return sucursales;
  }
  $scope.toggleRubro = function($index){
    if($scope.disponibles.indexOf($scope.rubros[$index]) === -1){
      $scope.disponibles.push($scope.rubros[$index]);
    }else{
      $scope.disponibles.splice($scope.disponibles.indexOf($scope.rubros[$index]),1);
    }
  };
  $scope.openMenu = function($mdMenu, ev) {
    originatorEv = ev;
    $mdMenu.open(ev);
  };
  $scope.vistaLista = function(){
    document.querySelector('#cont-rubros').classList.remove("entrada-lateral-izquierda");
    document.querySelector('#cont-sucursales').classList.remove("salida-lateral-izquierda");
    document.querySelector('#cont-rubros').classList.add("salida-lateral-derecha");
    document.querySelector('#cont-sucursales').classList.add("entrada-lateral-derecha");
  };
  $scope.vistaRubros = function(){
    document.querySelector('#cont-rubros').classList.remove("salida-lateral-derecha");
    document.querySelector('#cont-sucursales').classList.remove("entrada-lateral-derecha");
    document.querySelector('#cont-rubros').classList.add("entrada-lateral-izquierda");
    document.querySelector('#cont-sucursales').classList.add("salida-lateral-izquierda");
  };
  $scope.activarBusq = function(){
    document.querySelector('.busq-rap').classList.add('visible');
  };
  $scope.deshabilitarBusq = function(){
    document.querySelector('.busq-rap').classList.remove('visible');
  }
  $scope.mover = function(letra){
    if(letra.estado == "activa"){
      var myElement = document.querySelector("div[letra='"+letra.letra+"']");
      var topPos = myElement.offsetTop;
      document.querySelector("#lista-sucursales").scrollTop = topPos;
      $scope.deshabilitarBusq();
    }
  }
}]);
