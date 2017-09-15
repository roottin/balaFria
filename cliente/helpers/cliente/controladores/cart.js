angular.module('balafria')
.controller('ctrlCart', ['$scope',"$sesion", function($scope,$sesion) {
  var yo = this;
  yo.nodo = document.querySelector('div.omni-cart');
  yo.estado = "min";
  //------------------ Eventos ---------------------------------
  yo.nodo.ondblclick=function(nodo){
    if(yo.nodo.classList.contains('abrir-cart')){
      yo.estado = 'min';
      cerrar(yo.nodo);
    }else{
      yo.estado = "max";
      abrir(yo.nodo);
    }
  };
  $scope.$on('actCart',function(){
    yo.nodo.classList.remove('inactivo');
    yo.nodo.classList.add('activo');
  })
}]);
function cerrar(nodo){
  nodo.classList.add('cerrado');
  nodo.classList.add('cerrar-cart');
  nodo.classList.remove('abierto');
  nodo.classList.remove('abrir-cart');
}
function abrir(nodo){
  nodo.classList.remove('cerrado');
  nodo.classList.remove('cerrar-cart');
  nodo.classList.add('abierto');
  nodo.classList.add('abrir-cart');
}