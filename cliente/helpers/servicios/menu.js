angular.module('balafria')
.factory('Menu', ['$resource', function($resource){
  return $resource('/api/menus/:id', null, {
    'update': { method:'PUT' },
    'consulta':{
    	method:'GET',
    	url:'/api/menus/:id',
    	params:{id: '@id'},
      isArray:true
    }
  });
}]);
