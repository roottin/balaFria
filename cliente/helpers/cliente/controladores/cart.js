angular.module('balafria')
.controller('ctrlCart', ['$scope',"$sesion", function($scope,$sesion) {
  var yo = this;
  yo.nodo = document.querySelector('div.omni-cart');
  //------------------ Eventos ---------------------------------
  yo.nodo.ondblclick=function(nodo){
    yo.nodo.classList.remove('cerrado');
    yo.nodo.classList.add('abierto');
    yo.nodo.classList.add('abrir');
  };
  $scope.$on('actCart',function(){
    yo.nodo.classList.remove('inactivo');
    yo.nodo.classList.add('activo');
  })
}])
