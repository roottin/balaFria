angular.module('balafria')
.factory('productos', ['$resource', function($resource){
  return $resource('/api/producto/:id', null, {
    'update': { method:'PUT' },
    'desasociar':{
    	method:'delete',
    	url:'/api/producto/:id_detalle_menu&:id_producto',
    	params:{id_menu: '@id_menu',id_proveedor:'@id_producto'}
    }
  });
}]);
