angular.module('balafria')
.factory('TipoImagen', ['$resource', function($resource){
  return $resource('/api/tipoImagenes/:id', null, {
    'update': { method:'PUT' }
  });
}]);
