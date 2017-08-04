angular.module('balafria')
.controller('ctrlSucursal', ['Categorias','Upload','$mdToast','$state','Sucursales','$scope','$timeout','$sesion','$mdDialog','$http', function (Categorias,Upload,$mdToast,$state,Sucursales,$scope,$timeout,$sesion,$mdDialog,$http){
  var yo = this;

  if(!$state.params.sucursal){
    $state.go('proveedor.dashboard');
  }
  //variables secundarias
  yo.textoCat = true;
  yo.newCat = {
    titulo:"Nombre de la categoria",
  }
  //variables principales
  yo.SUID = 0; //Secuencia UID de objetos creados temporalmente
  yo.edit=false;
  yo.datos = null;
  yo.temp = {};
  yo.usuario = null;
  yo.icono = "edit";
  yo.paths = [];
  yo.proveedor = false;
  yo.cliente = false;
  Sucursales.get({id:$state.params.sucursal},function(result){
    $timeout(function(){
      yo.datos = angular.copy(result);
      yo.temp = completarTemp(result);
      yo.inicializarTemp();
    });
    //cargo menu
    Sucursales.getMenu({id:result.id_menu},function(result){
      yo.menu = yo.inicializarMenu(result);
    });
    $sesion.obtenerPerfil()
      .then(function(result){
        yo.usuario = result;
        if(yo.usuario.tipo == "proveedor"){
          yo.proveedor = true;
        }
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
    if(temp.contactos.length){
      var tipos={
        "insta":{"icono":"ion-social-instagram"},
        "phone":{"icono":"ion-android-call"},
        "web":{"icono":"ion-android-globe"},
        "face":{"icono":"ion-social-facebook"},
        "tweet":{"icono":"ion-social-twitter"}
      };
      temp.contactos = temp.contactos.map(contacto => {
        return {
          contenido: contacto.valor,
          icono: tipos[contacto.tipo].icono,
          clase: contacto.tipo
        }
      });
    }
  };
  yo.inicializarMenu = function(menu){
    menu.categorias = menu.categorias.map(function(categoria){
      categoria.class="edit";
      categoria.icono="edit";
      categoria.textoCat = (categoria.titulo)?true:false;
      categoria.edit = false;
      categoria.newPro = {}
      return categoria;
    });
    return menu;
  }
  //fin funciones de inicalizacion
  yo.cambioBanner = function(){
    document.querySelector('#bannerFile').click();
  }
  $scope.cambio = function(files){
    yo.temp.banner = {
      ruta:(window.URL || window.webkitURL).createObjectURL( files[0] ),
      file:files[0],
      cambio:true
    }
    document.querySelector('#banner').setAttribute('src',yo.temp.banner.ruta);
    $timeout(function(){
      yo.temp.cambio = true;
    });
  }
  yo.guardarCambios = function(){
    if(yo.temp.banner.cambio){
      Upload.upload({
          url: '/api/sucursal/banner/'+yo.temp.id_sucursal,
          data:{
            file:yo.temp.banner.file,
            id_sucursal: yo.temp.id_sucursal
          }
      })
        .then(function(resp){
          yo.datos.banner = resp.data.banner;
        })
    }
    $http.put('/api/sucursal/'+yo.temp.id_sucursal,yo.temp)
      .then(function(resp){
        yo.datos = angular.copy(resp.data);
        yo.temp = completarTemp(resp.data);
        yo.inicializarTemp();
      });
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
    cambio = evaluarCambios(yo.datos,yo.temp);
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
  yo.modificarZona = function(zona){
      if(zona.icono === "edit"){
        if(!yo.mapa.editando){
          yo.mapa.editando = zona.id;
          var path = yo.buscarPath(zona);
          zona.icono = "save";
          zona.clase = "pulse";
          yo.mapa.offClick = $scope.$on('leafletDirectiveMap.click', function(event, args) {
            var leafEvent = args.leafletEvent;
              yo.mapa.coordenadas.push({
                latlng:{lat:leafEvent.latlng.lat,lng:leafEvent.latlng.lng},
                secuencia:yo.mapa.coordenadas.length
              });
              path.latlngs = [];
              path.latlngs=yo.mapa.coordenadas.map(coordenada => {return coordenada.latlng});
           });
        }else{
          $mdToast.show(
                $mdToast.simple()
                  .textContent("Debe culminar de editar un elemento antes de pasar al siguiente")
                  .position('top right')
                  .hideDelay(3000)
              );
        }
      }else{
        zona.icono = "edit";
        zona.clase = "";
        yo.mapa.offClick();
        yo.mapa.editando = null;
        zona.coordenadas = yo.mapa.coordenadas;
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
      if(!yo.mapa.editando){
        yo.mapa.editando ="ubicacion;"
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
          yo.temp.ubicacion.latlng = leafEvent.latlng;
        });
      }else{
          $mdToast.show(
            $mdToast.simple()
              .textContent("Debe culminar de editar un elemento antes de pasar al siguiente")
              .position('top right')
              .hideDelay(3000)
          );
        }
    }
    else{
      yo.temp.ubicacion.edit = false;
      yo.temp.ubicacion.icono = 'edit';
      yo.temp.ubicacion.clase = '';
      yo.mapa.offClick();
      yo.mapa.editando = null;
    }
  }
  //contactos
  yo.agregarContacto = function(ev){
    $mdDialog.show({
      controller: 'ctrlAdd',
      controllerAs: 'contact',
      templateUrl: '/views/plantillas/proveedor/agregarContacto.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    }).then(function(datos){
      datos.id = "new"+yo.SUID++;
      yo.temp.contactos.push(datos);
    });
  }
  ////////////////////////////////MENU//////////////////////////////////////
  yo.buscarCategorias = function(ev){
    $mdDialog.show({
      controller: 'ctrlBucarCategorias',
      controllerAs: 'categorias',
      templateUrl: '/views/plantillas/proveedor/categorias.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    }).then(function(categoria){
      if(categoria){
        Sucursales.getMenu({id:$state.params.sucursal},function(result){
          yo.menu = yo.inicializarMenu(result);
        });
      }
    });
  }
  yo.toggleTitCat = function(){
    if(yo.textoCat){
      yo.newCat.titulo = "";
    }
    yo.textoCat = !yo.textoCat;
  }
  yo.agregarCategoria = function(id){
    id = id || "Img";
    document.querySelector('#categoria'+id).click();
  }
  yo.agregarImagen = function(id){
    document.querySelector('#'+id).click();
  }
  $scope.colocarImagen = function(files,seudoId){
    var id = seudoId.substr(9,seudoId.length-1);
    if(seudoId.substr(0,9)=="newProduc"){
      yo.menu.categorias.forEach(function(categoria){
        console.log(categoria.id,id);
        if(categoria.id == id){
          categoria.newPro.file = files[0];
          categoria.newPro.ruta = (window.URL || window.webkitURL).createObjectURL( files[0] );
          document.querySelector('#newP'+id).setAttribute('src',categoria.newPro.ruta);
        }
      });
    }
  }
  $scope.cambioCategoria = function(files,seudoId){
    if(!seudoId){
      yo.newCat.file = files[0];
      yo.newCat.ruta = (window.URL || window.webkitURL).createObjectURL( files[0] );
      document.querySelector('#categoria').setAttribute('src',yo.newCat.ruta);
    }else{
      var id = seudoId.substr(9,seudoId.length-1);
      yo.menu.categorias.forEach(function(categoria){
        if(categoria.id==id){
          categoria.ruta = (window.URL || window.webkitURL).createObjectURL( files[0] );
          categoria.file = files[0];
          document.querySelector('#cat'+categoria.id).setAttribute('src',yo.newCat.ruta);
        }
      })
    }
  }
  yo.guardarCategoria = function(categoria){
    if(categoria=="nueva"){
      if((yo.newCat.titulo != "Nombre de la categoria")&&(yo.newCat.ruta)){
        Upload.upload({
          url: '/api/categorias/',
          data:{
            file:yo.newCat.file,
            id_menu: yo.menu.id_menu,
            titulo: yo.newCat.titulo,
            id_proveedor:yo.usuario.id
          }
        })
          .then(function(resp){
            if(!yo.menu.categorias){
              yo.menu.categorias = [];
            }
            yo.menu.categorias.push(resp);
            $mdToast.show(
              $mdToast.simple()
                .textContent("Categoria Agregada de forma exitosa")
                .position('top right')
                .hideDelay(3000)
            );
            yo.newCat = {
              titulo:"Nombre de la categoria",
            }
            document.querySelector('#categoria').setAttribute('src','');
            Sucursales.getMenu({id:$state.params.sucursal},function(result){
              yo.menu = yo.inicializarMenu(result);
            });
          });
      }else{
        $mdToast.show(
          $mdToast.simple()
            .textContent("Debe agregar una imagen antes de poder continuar")
            .position('top right')
            .hideDelay(3000)
        );
      }
    }else{
      if(!categoria.edit){
        categoria.edit = !categoria.edit;
        categoria.class="guardar";
        categoria.icono ="save";
      }else{
        Upload.upload({
          url: '/api/categorias/imagen',
          data:{
            file:categoria.file,
            id_categoria: categoria.id_categoria,
          }
        })
          .then(function(resp){
            if(!yo.menu.categorias){
              yo.menu.categorias = [];
            }
            yo.menu.categorias.push(resp);
            $mdToast.show(
              $mdToast.simple()
                .textContent("Categoria modificada de forma exitosa")
                .position('top right')
                .hideDelay(3000)
            );
            Categorias.update({id:categoria.id},{
              titulo:categoria.titulo
            })
            Sucursales.getMenu({id:$state.params.sucursal},function(result){
              yo.menu = yo.inicializarMenu(result);
            });
          });
      }
    }
  }
  yo.borrarCategoria = function(categoria){
    Categorias
      .desasociar({id_categoria:categoria.id_categoria,id_menu:yo.menu.id_menu})
      .$promise
      .then(function(result){
        $mdToast.show(
          $mdToast.simple()
            .textContent("categoria desasociada con exito")
            .position('top right')
            .hideDelay(3000)
        );
        Sucursales.getMenu({id:$state.params.sucursal},function(result){
          yo.menu = yo.inicializarMenu(result);
        });
      });
  }
  yo.agregarMenu = function(ev){
    $mdDialog.show({
      controller: 'ctrlAddMenu',
      controllerAs: 'menu',
      templateUrl: '/views/plantillas/proveedor/agregarMenu.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    }).then(function(menu){
      $mdToast.show(
          $mdToast.simple()
            .textContent("Menu "+menu.nombre+" creado de forma exitosa")
            .position('top right')
            .hideDelay(3000)
        );
    });
  }
  yo.cambiarMenu =  function(ev){
    $mdDialog.show({
      controller: 'ctrlCambiarMenu',
      controllerAs: 'menu',
      templateUrl: '/views/plantillas/proveedor/cambiarMenu.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    }).then(function(menu){
      yo.menu = menu;
    });
  }
}]);
///////////////////////////////////////////////////////////////////////////////
//////////////////////// Externas /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function completarTemp(datos){
  var temp = angular.copy(datos);
  //inicializacion de propiedades faltantes
  var propiedades = [
    {"nombre":"banner","tipo":"objeto"},
    {"nombre":"zonasAtencion","tipo":"arreglo"},
    {"nombre":"contactos","tipo":"arreglo"},
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
  if(datos.coordenadas){
    path.latlngs =datos.coordenadas.map(coordenada => {return coordenada.latlng});
  }
  return path;
}
function evaluarCambios(datos,temp){
  //descripcion y nombre
  var cambio = false;
  console.log(temp.ubicacion,datos.ubicacion);
  if(temp.nombre !== datos.nombre){
    return true;
  }
  if(temp.descripcion !== datos.descripcion){
    return true;
  }
  //contactos
  if(datos.hasOwnProperty('contactos')){
    if(datos.contactos.length !== temp.contactos.length){
      return true;
    }
    var vuelta = 0;
    datos.contactos.forEach(function(contacto){
      if(temp.contactos[vuelta]!=contacto){
        cambio = true;
      }
    });
    if(cambio){return cambio;}
  }else{
    if (temp.contactos.length) {
      return true;
    }
  }
  //ubicacion
  if(datos.hasOwnProperty('ubicacion')){
    if(datos.ubicacion.latlng !== temp.ubicacion.latlng){
      return true;
    }
  }else{
    if(temp.ubicacion.latlng){
      return true;
    }
  }
  //zonas atencion
  if(datos.hasOwnProperty('zonasAtencion')){
    if(datos.zonasAtencion.length !== temp.zonasAtencion.length){
      return true;
    }
    var vuelta = 0;
    datos.zonasAtencion.forEach(function(zona){
      if(temp.zonasAtencion[vuelta]!=zona){
        cambio = true;
      }
    });
    if(cambio){return cambio;}
  }else{
    if(temp.zonasAtencion.length){
      return true;
    }
  }
  //sin cambios
  return false;
}