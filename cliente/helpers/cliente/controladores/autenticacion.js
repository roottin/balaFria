angular
    .module("balafria")
    .controller("ctrlInicio", ctrlLogCliente);

function ctrlLogCliente( $mdDialog,$http,$sesion,$state,$auth,$mdToast,$mdSidenav) {
    var yo = this;
    yo.registro = function(){
        $http.post('/api/cliente',yo.cliente)
          .then(function(resp){
            var user = {
              "nombre":resp.data.nombre,
              "apellido":resp.data.apellido,
              "documento":resp.data.documento,
              "id":resp.data.id_cliente,
              "email":resp.data.email,
              "token":resp.data.token,
            };
            $sesion.crear(user,'cliente').conectar();
            $state.go('cliente.iniciado');
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
              $state.go("cliente.iniciado");
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
    yo.toggleLeft = buildToggler('left');
    yo.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }
}
