angular.module('balafria')
.factory('Paises', ['$resource', function($resource){
  return $resource('/api/paises/:id', null, {
    'update': { method:'PUT' }
  });
}]);
