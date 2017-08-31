angular.module('balafria')
.factory('Proveedores', ['$resource', function($resource){
  return $resource('/api/proveedores/:id', null, {
    'update': { method:'PUT' }
  });
}]);
