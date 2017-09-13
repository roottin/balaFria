angular.module('balafria')
.factory('Favs', ['$resource', function($resource){
  return $resource('/api/favoritos/:id', null, {
    'get':{
      	method:'GET',
      	//usa id_cliente
      	url:'/api/favorito/cliente/:id',
      	params:{id: '@id'},
      	isArray:true
    },
    'getClientes':{
      	method:'GET',
      	//usa id_sucursal
      	url:'/api/favorito/sucursal/:id',
      	params:{id: '@id'},
      	isArray:true
    },
    'add':{
      method:'POST',
      url:'/api/favoritos'
    },
    'remove':{
      method:'DELETE',
      url:'/api/favorito/:id',
      params:{id: '@id'},
    }
  });
}]);
