angular.module('balafria')
.controller('ctrlSucursalCliente', ['$rootScope','$stateParams','Categorias','Productos','$mdToast','$state','Sucursales','$scope','$timeout','$sesion','$mdDialog','$http','Proveedores', function ($rootScope,$stateParams,Categorias,Productos,$mdToast,$state,Sucursales,$scope,$timeout,$sesion,$mdDialog,$http,Proveedores){
  var yo = this;
  $state.params = $stateParams;
  yo.SUID = 0; //Secuencia UID de objetos creados temporalmente
  yo.datos = null;
  yo.paths = [];
  if(!$state.params.sucursal){
    $state.go('cliente');
  }
  Sucursales.get({id:$state.params.sucursal},function(result){
    $timeout(function(){
      yo.datos = angular.copy(result);
    });
    //cargo menu
    Sucursales.getMenu({id:result.id_menu},function(result){
      yo.menu = yo.inicializarMenu(result);
    });
    Proveedores
      .query({id:result.id_proveedor})
      .$promise
      .then(function(result){
        yo.proveedor = result[0];
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
    menu.filtrado = angular.copy(menu.categorias);
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
  yo.agregarAlCarrito = function(producto){
    $rootScope.$broadcast('actCart');
  };
  /////////////////////////////// FILTRADO //////////////////////////////////////
  // NOTE:miguel aqui coloca las funciones de filtrado para categoria y producto
      $scope.selectedItem;
      $scope.getSelectedText = function() {
        if ($scope.selectedItem !== undefined) {
            yo.menu.filtrado = [];
            yo.menu.filtrado = [$scope.selectedItem];
            return $scope.selectedItem.titulo;
        } else {
          return "Por favor seleccione un item";
        }
      }
      $scope.$watch(function(scope) { return scope.campoBusqueda },
          function(valorNuevo, valorAnterior) {
            if(valorNuevo){
              yo.menu.filtrado = [];
              yo.menu.categorias.forEach(function(categoria){
                categoria.productos.forEach(function(producto){
                  if(producto.nombre.toUpperCase().search(valorNuevo.toUpperCase()) !== -1){
                    var agregar = false;
                    yo.menu.filtrado.forEach(function(catFiltrada){
                      if(catFiltrada.id_categoria == categoria.id_categoria){
                        catFiltrada.productos.push(angular.copy(producto));
                        agregar = false;
                      }else{
                        agregar = true;
                      }
                    });
                    if(yo.menu.filtrado.length == 0){
                      agregar = true;
                    }
                    if(agregar == true){
                      yo.menu.filtrado.push(angular.copy(categoria));
                      yo.menu.filtrado[yo.menu.filtrado.length -1].productos = [];
                      yo.menu.filtrado[yo.menu.filtrado.length -1].productos.push(angular.copy(producto));
                    }
                  }
                })
              });
            }else{
              if(yo.menu){
                yo.menu.filtrado = angular.copy(yo.menu.categorias);
                $scope.selectedItem = undefined;
              }
            }
          });
  /////////////////////////////// FILTRADO //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
}]);
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
  };
  if(datos.coordenadas){
      path.latlngs =datos.coordenadas.map(coordenada => {return coordenada.latlng});
    }
  return path;
}
