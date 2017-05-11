angular
    .module("balafria")
    .controller("ctrlLogCliente", ctrlLogCliente)
    .controller("ctrlInicio", LoginController);

function LoginController($auth, $state,$scope,$sesion,$mdDialog) {
    $scope.showAdvanced = function(ev) {
        $mdDialog.show({
          controller: 'ctrlLogCliente',
          controllerAs: 'log',
          templateUrl: '/views/plantillas/cliente/inicio.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      });
    };
}
function ctrlLogCliente( $mdDialog,$http,$sesion,$state,$auth) {
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
            $sesion.crear(response.data.user,'cliente').conectar();
            yo.hide();
            $state.go("frontPage.iniciado");
        })
        .catch(function(response){
            // Si ha habido errores llegamos a esta parte
            console.error(new Error("error de autenticacion"));
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
