angular.module('balafria')
.factory('Proveedores', ['$resource', function($resource){
  return $resource('/proveedor/:id', null, {
    'update': { method:'PUT' }
  });
}]);
