angular.module('balafria')
.controller('ctrlMap', ['$sesion','$scope','Rubros','Sucursales','$rootScope','$state', function ($sesion,$scope,Rubros,Sucursales,$rootScope,$state) {
  angular.extend($rootScope, {
        Acarigua: {
            lat: 9.55972,
            lng: -69.20194,
            zoom: 13
        }
    });
    $scope.clase="sin-logear";
  Rubros
    .query(function(){ })
    .$promise
    .then(function(result){
        $scope.rubros = result;
    });
  $sesion.obtenerPerfil()
    .then(function(perfil){
      $scope.usuario = perfil;
      $scope.clase="logeado";
    })
    .catch(function(error){
      $scope.usuario = null;
    });
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
  $scope.disponibles = [];
  $scope.openMenu = function($mdMenu, ev) {
    originatorEv = ev;
    $mdMenu.open(ev);
  };
  $scope.buscarSucursales = function(){
    Sucursales
      .buscar()
      .$promise
      .then(function(result){
        $scope.sucursales = $scope.organizarLista(result);
        $scope.vistaLista();
      })
  }
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
  $scope.buscarSucursalesRubro = function(rubro){
    Sucursales
      .buscarPorRubro({id:rubro.id_rubro})
      .$promise
      .then(function(result){
        $scope.sucursales = [];
        $scope.sucursales = $scope.organizarLista(result);
        $scope.vistaLista();
      })
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
