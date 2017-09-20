angular.module('balafria')
.controller('ctrlCart', ['$scope',"$sesion", function($scope,$sesion) {
  var yo = this;
  yo.nodo = document.querySelector('div.omni-cart');
  yo.estado = "min";
  yo.ordenes = [];
  /*yo.ordenes = [
    {
      "tipo":"dom",
      "total":40000,
      "proveedor":{
        "id":1,
        "nombre":"Pizzeria el aguila",
        "ruta":"storage\\proveedor\\file-1503879283939.jpg"
      },
      "productos":[
        {
          "id":1,
          "ruta":"storage\\producto\\file-1504151000194.jpg",
          "nombre":"Comida Gourmet",
          "descripcion":"comida gourmet de la mas fina estampa",
          "precio":20000,
          "cantidad":1
        },{
          "id":2,
          "ruta":"storage\\rubro\\file-1503846097245.jpg",
          "nombre":"Pizza Margarita",
          "descripcion":"Queso mozarella,salsa y jamon",
          "precio":20000,
          "cantidad":1
        }
      ]
    }
  ];*/
  //------------------ Eventos ---------------------------------
  yo.nodo.ondblclick=function(nodo){
    if(yo.nodo.classList.contains('abrir-cart')){
      yo.estado = 'min';
      cerrar(yo.nodo);
    }else{
      yo.estado = "max";
      abrir(yo.nodo);
    }
  };
  $scope.$on('actCart',function(event,data){ 
    yo.evaluarOrdenes(data.proveedor,data.producto);
    yo.nodo.classList.remove('inactivo');
    yo.nodo.classList.add('activo');
  })
  //------------------ Manejo de datos ---------------------------------
  yo.evaluarOrdenes = function(proveedor,producto){
    var asignado = false;
    //busco en las ordenes
    yo.ordenes = yo.ordenes.map(function(orden){
      if(orden.proveedor.id_proveedor === proveedor.id_proveedor){
        orden.productos = orden.productos.map(function(oldProducto){
          if(oldProducto.id_producto == producto.id_producto){
            asignado = true;
            oldProducto.cantidad++;
          }
          return oldProducto;
        });
        if(!asignado){
          asignado = true;
          producto.cantidad=1;
          orden.productos.push(producto);
        }
        orden.total = yo.calcularTotal(orden.productos);
      }
      return orden;
    });
    if(!asignado){
      yo.agregarOrden(proveedor,producto);
    }
  };
  yo.agregarOrden = function(proveedor,producto){
    producto.cantidad=1;
      yo.ordenes.push({
        "proveedor":proveedor,
        "productos":[producto],
        "total":producto.precio
      });
  };
  yo.calcularTotal = function(productos){
    var total = 0;
    productos.forEach(function(producto){
      total = parseFloat(total) + (parseFloat(producto.precio) * parseFloat(producto.cantidad));
    });
    return total; 
  };
  yo.agregar = function(producto,orden){
    producto.cantidad++;
    orden.total = yo.calcularTotal(orden.productos);
  };
  yo.remover = function(producto,orden){
    producto.cantidad--;
    if(producto.cantidad == 0){
      yo.removerProducto(producto,orden);
    }
    orden.total = yo.calcularTotal(orden.productos);
  };
  yo.removerProducto = function(producto,orden){
    orden.productos.splice(orden.productos.indexOf(producto),1);
  };
}]);
function cerrar(nodo){
  nodo.classList.add('cerrado');
  nodo.classList.add('cerrar-cart');
  nodo.classList.remove('abierto');
  nodo.classList.remove('abrir-cart');
}
function abrir(nodo){
  nodo.classList.remove('cerrado');
  nodo.classList.remove('cerrar-cart');
  nodo.classList.add('abierto');
  nodo.classList.add('abrir-cart');
}