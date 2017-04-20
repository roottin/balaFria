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

  var skipIfLoggedIn = ['$q', '$auth', function($q, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.reject();
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }];

  var loginRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.resolve();
    } else {
      $location.path('/Autenticar');
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
        }
      }
    })
      .state('frontPage.main', {
        url: '/main',
        templateUrl: '/views/plantillas/cliente/front-main.html',
        controller: 'ctrlMap'
      })
      .state('frontPage.registro', {
        url: '/registro',
        templateUrl: '/views/plantillas/cliente/front-registro.html',
        controller: 'ctrlRegistro',
        controllerAs: 'registro',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
      .state('frontPage.inicio', {
        url: '/Autenticar',
        templateUrl: '/views/plantillas/cliente/front-inicio.html',
        controller: 'ctrlInicio',
        controllerAs: 'inicio',
        resolve: {
          skipIfLoggedIn: skipIfLoggedIn
        }
      })
    //proveedor
    .state('proveedor',{
      url: '/proveedor',
      templateUrl: '/views/plantillas/proveedor/front.html',
      controller: 'ctrlProveedor',
    })
    //admin
    .state('admin',{
      url: '/admin',
      templateUrl: '/views/plantillas/admin/front.html',
      controller: 'ctrlAdmin',
    })
      .state('admin.rubro',{
        url:'/rubros',
        templateUrl: '/views/plantillas/admin/rubro.html',
        controller: 'ctrlRubro as up',
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
            var token = localStorage.getItem(tokenName);
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
