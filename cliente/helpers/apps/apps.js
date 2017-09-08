angular.module('balafria', ['ngMaterial','ngMessages','ngRoute', 'ngResource','ui.router',"satellizer",'leaflet-directive','ngFileUpload'])
.config(['$stateProvider','$urlRouterProvider','$mdThemingProvider','$authProvider','$compileProvider', function ($stateProvider,$urlRouterProvider,$mdThemingProvider,$authProvider,$compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
  //-------------------------------- Autenticacion ----------------------------------------
  $authProvider.loginUrl = "/api/autenticar";
  $authProvider.signupUrl = "/api/registrar";
  $authProvider.tokenName = "token";
  $authProvider.tokenPrefix = "balaFria";
  // Google
  $authProvider.google({
      clientId: '163659061347-caaqel0ef9nid4nv79kamoofcvkche33.apps.googleusercontent.com'
    });

  //------------------------ Rutas ---------------------------------------------------
  $urlRouterProvider.otherwise('/cliente');
  //-----------------------------------------cliente
  $stateProvider
    .state('cliente', {
      url: '/cliente',
      views:{
        "@":{
          templateUrl: '/views/plantillas/cliente/front.html',
        },
        "header@cliente":{
          templateUrl:"/views/plantillas/cliente/header.html",
          controller:'ctrlHeaderCli',
          controllerAs:'header'
        },
        "body@cliente":{
          templateUrl: '/views/plantillas/cliente/front-main.html',
          controller: 'ctrlMap'
        }
      }
    })
      .state('cliente.sucursal', {
        url:'/sucursal',
        views:{
          "body@cliente":{
            templateUrl: '/views/plantillas/cliente/sucursal.html',
            controller: 'ctrlSucursalCliente',
            controllerAs:'sucursal'
          }
        },
        params:{
          sucursal: null
        }
      })
       .state('cliente.formasDePago', {
        url:'/formaDePago',
        views:{
          "body@cliente":{
            templateUrl: '/views/plantillas/cliente/formasDePago.html',
            controller: 'ctrlFormasDePago',
            controllerAs:'user'
          }
        },
        resolve:{
          loginRequired: clienteLoggedRequired
        }
      })
       .state('cliente.historial', {
        url:'/historial',
        views:{
          "body@cliente":{
            templateUrl: '/views/plantillas/cliente/historial.html',
            controller: 'ctrlHistorial',
            controllerAs:'user'
          }
        },
        resolve:{
          loginRequired: clienteLoggedRequired
        }
      })
       .state('cliente.seguridad', {
        url:'/seguridad',
        views:{
          "body@cliente":{
            templateUrl: '/views/plantillas/cliente/seguridad.html',
            controller: 'ctrlSeguridad',
            controllerAs:'user'
          }
        },
        resolve:{
          loginRequired: clienteLoggedRequired
        }
      })
       .state('cliente.perfil', {
        url:'/perfil',
        views:{
          "body@cliente":{
            templateUrl: '/views/plantillas/cliente/perfil.html',
            controller: 'ctrlPerfil',
            controllerAs:'perfil'
          }
        },
        resolve:{
          loginRequired: clienteLoggedRequired
        }
      })
    //-----------------------------------------proveedor--------------------------------------------------
    .state('proveedor',{
      url: '/proveedor',
      views:{
        "@":{
          templateUrl: '/views/plantillas/proveedor/front.html',
        },
        "header@proveedor":{
          templateUrl:"/views/plantillas/proveedor/headerLogOff.html",
          controller:'ctrlLogPro'
        },
        "body@proveedor":{
          templateUrl: '/views/plantillas/proveedor/frontPage.html',
          controller: 'ctrlProveedor',
          controllerAs: 'up',
        }
      }
    })
      .state('proveedor.verificarCorreo',{
        url:"/correo",
        views:{
          "header@proveedor":{
            templateUrl:"/views/plantillas/proveedor/headerLogOff.html",
            controller:'ctrlLogPro'
          },
          "body@proveedor":{
            templateUrl: '/views/plantillas/proveedor/verificarCorreo.html',
            controller: 'ctrlCorreo',
            controllerAs: 'correo'
          }
        }
      })
      .state('proveedor.logIn',{
        url:"/login",
        views:{
          "body@proveedor":{
            templateUrl: '/views/plantillas/proveedor/login.html',
            controller: 'ctrlLogPro'
          },
          "foot@proveedor":{
            templateUrl: '/views/plantillas/proveedor/foot.html'
          }
        }
      })
      .state('proveedor.registro',{
        url:"/registro",
        views:{
          "body@proveedor":{
            templateUrl: '/views/plantillas/proveedor/registro.html',
            controller: 'ctrlProveedor',
            controllerAs: 'up',
          },
          "foot@proveedor":{
            templateUrl: '/views/plantillas/proveedor/foot.html'
          }
        }
      })
      .state('proveedor.dashboard',{
        url:'/dashboard',
        views:{
          "header@proveedor":{
            templateUrl:"/views/plantillas/proveedor/headerLogIn.html",
            controller:'ctrlHeaderPro',
            controllerAs:'header'
          },
          "body@proveedor":{
            templateUrl: '/views/plantillas/proveedor/dashboard.html'
          },
          "foot@proveedor":{
            templateUrl: '/views/plantillas/proveedor/foot.html'
          }
        },
        resolve:{
          loginRequired: ProveedorLoggedRequired
        }
      })
      .state('proveedor.perfil',{
        url:'/perfil',
        views:{
          "header@proveedor":{
            templateUrl:"/views/plantillas/proveedor/headerLogIn.html",
            controller:'ctrlHeaderPro',
            controllerAs:'header'
          },
          "body@proveedor":{
            templateUrl: '/views/plantillas/proveedor/perfil.html'
          },
          "foot@proveedor":{
            templateUrl: '/views/plantillas/proveedor/foot.html'
          }
        },
        resolve:{
          loginRequired: ProveedorLoggedRequired
        }
      })
      .state('proveedor.nuevaSucursal',{
        url:'/nuevaSucursal',
        views:{
          "header@proveedor":{
            templateUrl:"/views/plantillas/proveedor/headerLogIn.html",
            controller:'ctrlHeaderPro',
            controllerAs:'header'
          },
          "body@proveedor":{
            templateUrl: '/views/plantillas/proveedor/nuevaSucursal.html',
            controller:'ctrlNuevaSucursal',
            controllerAs:'sucursal'
          },
          "foot@proveedor":{
            templateUrl: '/views/plantillas/proveedor/foot.html'
          }
        },
        resolve:{
          loginRequired: ProveedorLoggedRequired
        }
      })
      .state('proveedor.sucursal',{
        url:'/sucursal',
        params:{
          sucursal: null
        },
        views:{
          "header@proveedor":{
            templateUrl:"/views/plantillas/proveedor/headerLogIn.html",
            controller:'ctrlHeaderPro',
            controllerAs:'header'
          },
          "body@proveedor":{
            templateUrl: '/views/plantillas/proveedor/sucursal.html',
            controller:'ctrlSucursal',
            controllerAs:'sucursal'
          },
          "foot@proveedor":{
            templateUrl: '/views/plantillas/proveedor/foot.html'
          }
        },
        resolve:{
          loginRequired: ProveedorLoggedRequired
        }
      })
    //-------------------------------------------admin-----------------------------------------------------
    .state('admin',{
      url: '/admin',
      views:{
        "@":{
          templateUrl: '/views/plantillas/admin/front.html',
          controller: 'ctrlAdmin',
        },
        "body@admin":{
          templateUrl: '/views/plantillas/admin/login.html',
          controller: 'ctrlAdminLog',
        }
      }
    })
      .state('admin.landing',{
        url:'/landing',
        views:{
          "body@admin":{
            templateUrl: '/views/plantillas/admin/landing.html',
            controller: 'ctrlLandAdmin',
          },
          "header@admin":{
            templateUrl: '/views/plantillas/admin/headerIn.html'
          }
        },
        resolve:{
          loginRequired: AdminLoggedRequired
        }
      });
    //------------------------ Tema -------------------------------------------------------
    $mdThemingProvider.theme('light')
          .primaryPalette('indigo')
          .accentPalette('blue-grey');
    $mdThemingProvider.theme('default')
          .primaryPalette('indigo')
          .accentPalette('blue-grey')
          .dark();

    /////////////////////////////////////////////////////////////////////////
    function AdminLoggedRequired($q, $location, $auth) {
      var deferred = $q.defer();
      var storage = sessionStorage.getItem('balaFria_token');
      if (storage !== null) {
        if(JSON.parse(storage).tipo == "admin"){
          deferred.resolve();
        }else{
          $location.path('/cliente');
        }
      } else {
        $location.path('/cliente');
      }
      return deferred.promise;
    };
    function ProveedorLoggedRequired($q, $location, $auth) {
      var deferred = $q.defer();
      var storage = sessionStorage.getItem('balaFria_token');
      if (storage !== null) {
        if(JSON.parse(storage).tipo == "proveedor"){
          deferred.resolve();
        }else{
          $location.path('/cliente');
        }
      } else {
        $location.path('/cliente');
      }
      return deferred.promise;
    };
    function clienteLoggedRequired($q, $location, $auth) {
      var deferred = $q.defer();
      var storage = sessionStorage.getItem('balaFria_token');
      if (storage !== null) {
        if(JSON.parse(storage).tipo == "cliente"){
          deferred.resolve();
        }else{
          $location.path('/cliente');
        }
      } else {
        $location.path('/cliente');
      }
      return deferred.promise;
    };
}])
//--------------------------------------- Manejo de Token en localStorage ----------------------------------
.config(['$httpProvider', '$authProvider', function($httpProvider, config) {
      $httpProvider.interceptors.push(['$q', function($q) {
        var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
        return {
          request: function(httpConfig) {
            var token = sessionStorage.getItem(tokenName);
            token = (token)?JSON.parse(token).token:'';
            if (token && config.httpInterceptor) {
              token = config.authHeader === 'Authorization' ? 'Bearer ' + token : token;
              httpConfig.headers[config.authHeader] = token;
            }
            return httpConfig;
          },
          responseError: function(response) {
            return $q.reject(response);
          }
        };
      }]);
    }]);
