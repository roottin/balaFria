angular.module('balafria')
.factory('Sucursales', ['$resource', function($resource){
  return $resource('/api/sucursal/:id', null, {
    'update': { method:'PUT' },
    'consulta':{
    	method:'GET',
    	url:'/api/sucursales/:id',
    	params:{id: '@id'},
      isArray:true
    },
    'buscar':{
    	method:'GET',
    	url:'/api/sucursal/all',
      isArray:true
    },
    'getMenu':{
      method:'GET',
    	url:'/api/menu/:id',
    	params:{id: '@id'},
    }
  });
}]);
