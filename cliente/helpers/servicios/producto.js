angular.module('balafria')
.factory('Productos', ['$resource', function($resource){
  return $resource('/api/producto/:id', null, {
    'update': { method:'PUT' },
    'desasociar':{
    	method:'delete',
    	url:'/api/producto/:id_detalle_menu&:id_producto',
    	params:{id_detalle_menu: '@id_detalle_menu',id_producto:'@id_producto'}
    },
    'consulta':{
    	method:'GET',
    	url:'/api/productos/:id_proveedor&:id_detalle_menu',
    	params:{id_proveedor: '@id_proveedor',id_detalle_menu: '@id_detalle_menu'},
      isArray:true
    }
  });
}]);
