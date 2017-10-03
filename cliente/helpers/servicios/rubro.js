angular.module('balafria')
.factory('Rubros', ['$resource', function($resource){
  return $resource('/api/rubros/:id', null, {
    'update': { method:'PUT' }
  });
}]);
