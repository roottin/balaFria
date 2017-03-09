var Login = function(){

  var self = this;

  self.construirLogin = function(){
    var modal = UI.crearVentanaModal({
      clases:['logIn'],
      cabecera:{
        html: '<div class="material-icons md-36 lightgreen500">account_circle</div>'
      },
      cuerpo:{
        formulario:
          {
            altura: 150,
            campos:[
              {
                tipo : 'campoDeTexto',
                parametros : {requerido:true,titulo:'Nombre de Usuario o Email',nombre:'user',tipo:'simple',eslabon:'area',usaToolTip:true}
              },{
                tipo : 'campoDeTexto',
                parametros : {requerido:true,titulo:'Clave',nombre:'clave',tipo:'password',eslabon:'area',usaToolTip:true}
              }
            ]
          },
        tipo: 'nuevo', //operacion a realizar
      },
      pie:{
          clases:['botonera'],
          html:'<button type="button" class="icon material-icons green500">send</button>'
      }
    });
  };

};
