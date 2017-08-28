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
    'filtro':{
      method:'POST',
      url:'/api/sucursal/filtro',
      isArray:true
    },
    'buscar':{
    	method:'GET',
    	url:'/api/sucursal/all',
      isArray:true
    },
    'buscarPorRubro':{
    	method:'GET',
    	url:'/api/sucursal/rubro/:id_rubro&:id_ciudad',
    	params:{id_rubro: '@id_rubro',id_ciudad :'@id_ciudad'},
      isArray:true
    },
    'getMenu':{
      method:'GET',
    	url:'/api/menu/:id',
    	params:{id: '@id'},
    },
    'getByCiudad':{
      method:'GET',
      url:'/api/sucursal/ciudad/:id',
      params:{id: '@id'},
    }
  });
}]);
