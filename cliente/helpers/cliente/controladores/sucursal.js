angular.module('balafria')
.controller('ctrlSucursalCliente', ['$stateParams','Categorias','Productos','$mdToast','$state','Sucursales','$scope','$timeout','$sesion','$mdDialog','$http', function ($stateParams,Categorias,Productos,$mdToast,$state,Sucursales,$scope,$timeout,$sesion,$mdDialog,$http){
  var yo = this;
  $state.params = $stateParams;
  yo.SUID = 0; //Secuencia UID de objetos creados temporalmente
  yo.datos = null;
  yo.paths = [];
  Sucursales.get({id:$state.params.sucursal},function(result){
    $timeout(function(){
      yo.datos = angular.copy(result);
    });
    //cargo menu
    Sucursales.getMenu({id:result.id_menu},function(result){
      yo.menu = yo.inicializarMenu(result);
    });
  });
  yo.inicializarMenu = function(menu){
    menu.categorias = menu.categorias.map(function(categoria){
      categoria.class="edit";
      categoria.icono="edit";
      categoria.textoCat = (categoria.titulo)?true:false;
      categoria.edit = false;
      categoria.newPro = {}
      categoria.productos = categoria.productos.map(function(producto){
        producto.icono="edit";
        producto.class="edit";
        producto.edit=false;
        producto.ant ={
          "ruta":producto.ruta,
          "nombre":producto.nombre,
          "descripcion":producto.descripcion,
          "secuencia":producto.secuencia,
          "precio":producto.precio,
        }
        return producto;
      });
      return categoria;
    });
    return menu;
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
    offClick : null,
    editando: null
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
  ////////////////////////////////MENU//////////////////////////////////////
  yo.cambiarMenu =  function(ev){
    $mdDialog.show({
      controller: 'ctrlCambiarMenu',
      controllerAs: 'menu',
      templateUrl: '/views/plantillas/proveedor/cambiarMenu.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    }).then(function(menu){
      Sucursales.getMenu({id:menu.id_menu},function(result){
        yo.menu = yo.inicializarMenu(result);
      });
    });
  }
}]);
///////////////////////////////////////////////////////////////////////////////
//////////////////////// Externas /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function crearPath(datos){
  var path = {
    id:datos.id,
    type:"polygon",
    color: '#303030',
    weight: 2,
    latlngs:[],
    message: "<h3>"+datos.nombre+"</h3><p>"+datos.descripcion+"</p>"
  }
  if(datos.coordenadas){
    path.latlngs =datos.coordenadas.map(coordenada => {return coordenada.latlng});
  }
  return path;
}
