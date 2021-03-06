angular.module('balafria')
.controller('ctrlAdd', ['$mdDialog', function ($mdDialog){
  var yo = this;
  //contacto
  yo.contacto ={
    contenido: "ejemplo",
    icono: 'ion-android-call',
    clase: 'phone'
  }
  yo.tipos={
    "insta":{"icono":"ion-social-instagram"},
    "phone":{"icono":"ion-android-call"},
    "web":{"icono":"ion-android-globe"},
    "face":{"icono":"ion-social-facebook"},
    "tweet":{"icono":"ion-social-twitter"}
  }
  yo.cambiarTipo = function(tipo){
    yo.contacto.icono = yo.tipos[tipo].icono;
    yo.contacto.clase = tipo;
  };
  //fin contacto
  yo.submit = function(){
    if((yo.contacto.contenido != "")&&(yo.contacto.contenido != "ejemplo")){
      $mdDialog.hide(yo.contacto);
    }
  };
  yo.cancel = function() {
      $mdDialog.hide();
  };
}])