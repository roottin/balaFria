angular.module('balafria')
.factory('Ciudades', ['$resource', function($resource){
  return $resource('/api/ciudades/:id', null, {
    'update': { method:'PUT' }
  });
}]);
