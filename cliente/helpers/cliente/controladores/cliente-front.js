angular.module('balafria')
.controller('ctrlMap', ['Favs','$mdDialog','leafletData','$sesion','$scope','Rubros','Sucursales','$rootScope','$state','$timeout', function (Favs,$mdDialog,leafletData,$sesion,$scope,Rubros,Sucursales,$rootScope,$state,$timeout) {
  //declaracion de variables
  $scope.disponibles = [];
  $scope.rubros = [];
  $scope.Sucursales = [];
  $scope.markers = [];
  $scope.clase="sin-logear";
  //optencion de datos
  angular.extend($rootScope, {
        center: {
            lat: 9.55972,
            lng: -69.20194,
            zoom: 13
        }
    });
  leafletData
    .getMap()
    .then(function(map){
      $scope.map = map;
    });
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
      Favs
        .get({id:perfil.id})
        .$promise
        .then(function(favs){
          $scope.favs = favs;
          $scope.gestionarFavs(favs);
        });
    })
    .catch(function(error){
      $scope.usuario = null;
    });
  $scope.buscarSucursales = function(){
    Sucursales
      .getByCiudad({id:$scope.ciudad.id_ciudad})
      .$promise
      .then(function(result){
        $scope.sucursales = $scope.organizarLista(result);
        $scope.vistaLista();
        $scope.ubicarSucursales();
        $scope.gestionarFavs();
      });
  }
  $scope.buscarSucursalesRubro = function(rubro){
    Sucursales
      .buscarPorRubro({"id_rubro":rubro.id_rubro,"id_ciudad":$scope.ciudad.id_ciudad})
      .$promise
      .then(function(result){
        $scope.sucursales = [];
        $scope.sucursales = $scope.organizarLista(result);
        $scope.vistaLista();
        $scope.ubicarSucursales();
        $scope.gestionarFavs();
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
  $scope.$on("cambio ciudad",function(event,data){
    $scope.ciudad = data;
    var center = {
      lat:data.latlng.lat,
      lng:data.latlng.lng,
      zoom:parseInt(data.zoom)
    }
    $scope.center = center;
  });
  $scope.$on("ubicacion obtenida",function(event){
    $scope.addUserUbication();
  })
  $scope.$watch(function(scope) { return scope.search },
              function(newValue, oldValue) {
                  if(newValue){
                    $scope.buscar(newValue);
                  }else{
                    $scope.vistaRubros();
                  }
              }
             );
//------------------ Manejo de UI ---------------------------------
  $scope.toggleFav = function(sucursal){
    if(!sucursal.fav){
      Favs
        .add({"id_sucursal":sucursal.id_sucursal,"id_cliente":$scope.usuario.id})
        .$promise
        .then(function(response){
            sucursal.class = "fill";
            sucursal.icono = "favorite";
            sucursal.fav = response.id;
        });
    }else{
       Favs
        .remove({"id":sucursal.fav})
        .$promise
        .then(function(response){
            sucursal.class = "";
            sucursal.icono = "favorite_border";
            sucursal.fav = false;
        });
    }
  }
  $scope.gestionarFavs = function(favs){
    favs = favs || $scope.favs || [];
    if(favs.length){
      favs.forEach(function(fav){
        $scope.sucursales.forEach(function(letra){
          letra.sucursales.forEach(function(sucursal){
            if(sucursal.id_sucursal == fav.id_sucursal){
              sucursal.class = "fill";
              sucursal.icono = "favorite";
              sucursal.fav = fav.id;
            }
          });
        });
      })
    }
  }
  $scope.addUserUbication = function() {
    var obtenida = false;
    if(!$scope.ubicacion){
      if($rootScope.position){
        $scope.ubicacion = {"lat":$rootScope.position.coords.latitude,"lng":$rootScope.position.coords.longitude};
        obtenida = true;
      }
    }else{
      obtenida = true;
    }
    if(obtenida){
      var html = "<div class='marker userUbi pulse'><i class='material-icons'>account_circle</i></div>"
      $scope.addMark(html,$scope.ubicacion,{"trigger":true,"on":$scope.trigger});
    }else{
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Localizacion')
          .textContent('Debes especificar tu ubicacion si deseas ordenar')
          .ariaLabel('Alert Dialog Demo')
          .ok('entendido')
          .theme('light')
      );
    }
  }
  //disparo esto
  $scope.addUserUbication();
  //cada vez que llego al mapa

  $scope.trigger = function(e){
    $scope.ubicacion = {"lat":e.latlng.lat,"lng":e.latlng.lng};
  };
  $scope.abrirSeguridad = function(){
    $state.go('cliente.seguridad');
  };
  $scope.filtrarFavoritos = function(){
    Sucursales
      .getbyFavs({"id_cliente":$scope.usuario.id,"id_ciudad":$scope.ciudad.id_ciudad})
      $promise
      .then(function(sucursales){
        $scope.sucursales = [];
        $scope.sucursales = $scope.organizarLista(result);
        $scope.vistaLista();
        $scope.ubicarSucursales();
        $scope.gestionarFavs();
      })
  };
  $scope.abrirFormasDePago = function(){
    $state.go("cliente.formasDePago");
  };
  $scope.verHistorial = function(){
    $state.go("cliente.historial");
  };
  $scope.buscar = function(value){
    Sucursales
      .filtro({filtro:value})
      .$promise
      .then(function(result){
        $scope.sucursales = [];
        $scope.sucursales = $scope.organizarLista(result);
        $scope.vistaLista();
        $scope.ubicarSucursales();
      });
  }
  $scope.ubicarSucursales = function(){
    $scope
      .removeAllMarkers()
      .then(function(){
        $scope.addUserUbication();
        $scope.sucursales.forEach(function(letra){
          letra.sucursales.forEach(function(sucursal){
            if(sucursal.id_coordenada){
              $scope.addMark(
                "<div class='marker' sucursal='"+sucursal.id_sucursal+"'>"+
                  "<img src='"+sucursal.ruta+"'>"+
                "</div>"
                ,{lat:sucursal.latitud,lng:sucursal.longitud}
              );
            }
          });
        });
        document
          .querySelectorAll('.marker')
          .forEach(function(marker){
            marker.onclick = function() {
              var mark = this;
              $timeout(function(){
                $scope.verSucursal(mark.getAttribute('sucursal'));
              });
            };
          });
      });
  }
  $scope.addMark = function(html,latLng,drag){
    drag = drag || {"trigger":false,"on":null};
    var markerLocation = new L.LatLng(latLng.lat, latLng.lng);
    var helloLondonHtmlIcon = new L.HtmlIcon({
        "html" : html
    });
    var marker = new L.Marker(markerLocation, {icon: helloLondonHtmlIcon,draggable:drag.trigger});
    if(drag.on){
      marker.on('drag', drag.on);
    }
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
  $scope.verSucursal = function(id){
    console.log(id);
    if(id){
      $state.go('cliente.sucursal',{"sucursal":id});
    }
  }
  $scope.organizarLista = function(result){
    $scope.letras = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('').map(function(letra){
      return {"letra":letra,"sucursales":[],"estado":"inactiva"};
    });
    var sucursales = [];
    result.forEach(function(sucursal){
      sucursal.icono = "favorite_border";
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
