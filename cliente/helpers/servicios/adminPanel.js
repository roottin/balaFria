angular.module('balafria')
.service('$adminPanel',function(){
  var self = this;

  self.getFechaHora = function(){
    return new Date();
  };

  self.getClientes = function($http,$scope){
    $http.get('/api/adminPanel/clientes')
      .success(function(data,status){
        $scope.clientes = data.clientes;
      });
  };
  self.getProveedores = function($http,$scope){
    $http.get('/api/adminPanel/proveedores')
      .success(function(data,status){
        $scope.proveedores = data.proveedores;
      });
  };
});
