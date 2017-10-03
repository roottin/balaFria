angular.module('balafria')
.factory('Categorias', ['$resource', function($resource){
  return $resource('/api/categoria/:id', null, {
    'update': { method:'PUT' },
    'desasociar':{
    	method:'delete',
    	url:'/api/categoria/:id_menu&:id_categoria',
    	params:{id_menu: '@id_menu',id_proveedor:'@id_categoria'}
    },
    'consulta':{
    	method:'GET',
    	url:'/api/categorias/:id_proveedor&:id_sucursal',
    	params:{id_proveedor: '@id_proveedor',id_sucursal:"@id_sucursal"},
      isArray:true
    }
  });
}]);
