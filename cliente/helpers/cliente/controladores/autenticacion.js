angular
    .module("balafria")
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

function LoginController($auth, $location,$scope,$sesion) {
    $scope.login = function(){
        $auth.login({
            nombre: $scope.nombre,
            clave: $scope.clave
        })
        .then(function(response){
            $sesion.crear(response.data).conectar();
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
}
