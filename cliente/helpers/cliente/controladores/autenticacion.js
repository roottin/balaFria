angular
    .module("balafria")
    .controller("ctrlLogCliente", ctrlLogCliente)
    .controller("ctrlRegistro", SignUpController)
    .controller("ctrlInicio", LoginController);

function SignUpController($auth, $location,$scope,$sesion) {
    $scope.signup = function() {
        $auth.signup({
            nombre: $scope.email,
            clave: $scope.password
        })
        .then(function(response) {
            $location.path("/trabajos");
        })
        .catch(function(response) {
            // Si ha habido errores, llegaremos a esta función
            console.error(new Error("error de autenticacion"));
        });
    };
}

function LoginController($auth, $location,$scope,$sesion,$mdDialog) {
    $scope.login = function(){
        $auth.login({
            nombre: $scope.nombre,
            clave: $scope.clave
        })
        .then(function(response){
            $sesion.crear(response.data,'proveedor').conectar();
            $location.path("/trabajos");
        })
        .catch(function(response){
            // Si ha habido errores llegamos a esta parte
            console.error(new Error("error de autenticacion"));
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
    };
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
function ctrlLogCliente( $mdDialog) {
    var yo = this;
    yo.registro = function(){
        console.log(yo.cliente);
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
