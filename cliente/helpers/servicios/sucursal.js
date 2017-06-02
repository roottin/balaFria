angular.module('balafria')
.factory('Sucursales', ['$resource', function($resource){
  return $resource('/api/sucursal/:id', null, {
    'update': { method:'PUT' },
    'consulta':{
    	method:'GET',
    	url:'/api/sucursales/:id',
    	params:{id: '@id'},
      isArray:true
    }
  });
}]);
