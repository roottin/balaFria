angular.module('balafria', ['ngMaterial','ngMessages','ngRoute', 'ngResource','ui.router',"satellizer",'leaflet-directive','ngFileUpload'])
.config(['$stateProvider','$urlRouterProvider','$mdThemingProvider','$authProvider', function ($stateProvider,$urlRouterProvider,$mdThemingProvider,$authProvider) {
  //-------------------------------- Autenticacion ----------------------------------------
  $authProvider.loginUrl = "/api/autenticar";
  $authProvider.signupUrl = "/api/registrar";
  $authProvider.tokenName = "token";
  $authProvider.tokenPrefix = "balaFria";
  // Google
  $authProvider.google({
      clientId: '163659061347-caaqel0ef9nid4nv79kamoofcvkche33.apps.googleusercontent.com'
    });

  var loginRequired =function(tipo) {
    if(tipo == "admin"){
      return AdminLoggedRequired;
    }else if(tipo == "proveedor"){
      return ProveedorLoggedRequired;
    }
  };

  var AdminLoggedRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
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
  }];
  var ProveedorLoggedRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
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
  }];

  //------------------------ Rutas ---------------------------------------------------
  $urlRouterProvider.otherwise('/cliente');

  //cliente
  $stateProvider
    .state('frontPage', {
      url: '/cliente',
      controller: 'ctrlFront',
      views:{
        "@":{
          templateUrl: '/views/plantillas/cliente/front.html',
        },
        "header@frontPage":{
          templateUrl:"/views/plantillas/cliente/headerLogOff.html",
          controller:'ctrlInicio'
        },
        "body@frontPage":{
          templateUrl: '/views/plantillas/cliente/front-main.html',
          controller: 'ctrlMap'
        }
      }
    })
      .state('frontPage.registro', {
        url: '/registro',
        templateUrl: '/views/plantillas/cliente/front-registro.html',
        controller: 'ctrlRegistro',
        controllerAs: 'registro'
      })
      .state('frontPage.inicio', {
        url: '/Autenticar',
        templateUrl: '/views/plantillas/cliente/front-inicio.html',
        controller: 'ctrlInicio',
        controllerAs: 'inicio'
      })
    //-----------------------------------------proveedor--------------------------------------------------
    .state('proveedor',{
      url: '/proveedor',
      views:{
        "@":{
          templateUrl: '/views/plantillas/proveedor/front.html',
        },
        "header@proveedor":{
          templateUrl:"/views/plantillas/cliente/headerLogOff.html",
          controller:'ctrlInicio'
        },
        "body@proveedor":{
        templateUrl: '/views/plantillas/proveedor/frontPage.html',
        controller: 'ctrlProveedor',
        }
      }
    })
      .state('proveedor.registro',{
        url:"/registro",
        views:{
          "body@proveedor":{
            templateUrl: '/views/plantillas/proveedor/registro.html'
          }
        }
      })
      .state('proveedor.sucursal',{
        url:'/sucursal',
        views:{
          "body@proveedor":{
            templateUrl: '/views/plantillas/proveedor/sucursal.html'
          }
        },
        resolve:{
          loginRequired: ProveedorLoggedRequired
        }
      })
      .state('proveedor.horario',{
        url:'/horario',
        views:{
          "body@proveedor":{
            templateUrl: '/views/plantillas/proveedor/horario.html'
          }
        },
        resolve:{
          loginRequired:ProveedorLoggedRequired
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
      })
      .state('admin.rubro',{
        url:'/rubros',
        views:{
          "body@admin":{
            templateUrl: '/views/plantillas/admin/rubro.html',
            controller: 'ctrlRubro as up',
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
    $mdThemingProvider.theme('default')
          .primaryPalette('indigo')
          .accentPalette('blue-grey')
          .dark();
}])
//--------------------------------------- Manejo de Token en localStorage ----------------------------------
.config(['$httpProvider', '$authProvider', function($httpProvider, config) {
      $httpProvider.interceptors.push(['$q', function($q) {
        var tokenName = config.tokenPrefix ? config.tokenPrefix + '_' + config.tokenName : config.tokenName;
        return {
          request: function(httpConfig) {
            var token = sessionStorage.getItem(tokenName);
            token = (token)?JSON.parse(token).token:'';
            console.log(token);
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
