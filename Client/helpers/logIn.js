var Login = function(){
  var construirLogin = function(){
    var modal = UI.crearVentanaModal({
      contenido: 'ancho',
      cabecera:{
        html: 'Nuevo '
      },
      cuerpo:{
        html:'hola'
      },
      pie:{
          html:   '<section modalButtons>'+
                  '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                  '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
                  '</section>'
      }
    });
  };
};
