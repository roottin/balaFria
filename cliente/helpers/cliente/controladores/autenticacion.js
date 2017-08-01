angular
    .module("balafria")
    .controller("ctrlLogCliente", ctrlLogCliente)
    .controller("ctrlInicio", LoginController);

function LoginController($auth, $state,$scope,$sesion,$mdSidenav) {
  $scope.toggleLeft = buildToggler('left');
  $scope.toggleRight = buildToggler('right');

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }
}
function ctrlLogCliente( $mdDialog,$http,$sesion,$state,$auth,$mdToast) {
    var yo = this;
    yo.registro = function(){
        $http.post('/api/cliente',yo.cliente)
          .then(function(resp){
            yo.hide();
            var user = {
              "nombre":resp.data.nombre,
              "apellido":resp.data.apellido,
              "documento":resp.data.documento,
              "id":resp.data.id_cliente,
              "email":resp.data.email,
              "token":resp.data.token,
            };
            $sesion.crear(user,'cliente').conectar();
            yo.hide();
            $state.go('frontPage.iniciado');
          });
    };
    yo.login = function(){
        $auth.login({
          field: yo.field,
          clave: yo.clave,
          tipo: "cliente"
        })
        .then(function(response){
            if(response.data.success){
              $sesion.crear(response.data.user,'cliente').conectar();
              yo.hide();
              $state.go("frontPage.iniciado");
            }else{
              $mdToast.show(
                $mdToast.simple()
                  .textContent("Error de Autenticacion")
                  .position('top right')
                  .hideDelay(3000)
              );
            }
        })
        .catch(function(response){
          console.error(new Error(response));
        });
    };
    yo.redirect = function(){
      $state.go('proveedor');
      yo.hide();
    }
    yo.authenticate = function(provider) {
      $auth.authenticate(provider);
    };
    yo.hide = function() {
        $mdDialog.hide();
    };
    yo.cancel = function() {
        $mdDialog.cancel();
    };
    yo.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}
