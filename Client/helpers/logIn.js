var Login = function(){
  var self = this;
  self.modal = null;
  self.plano = {
      "logIn":{
        "altura": 150,
        "campos":[
          {
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Nombre de Usuario o Email',nombre:'nombre',tipo:'simple',eslabon:'area',usaToolTip:true}
          },{
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Clave',nombre:'clave',tipo:'password',eslabon:'area',usaToolTip:true}
          }
        ]
      },
      "registrate":{
        "altura": 400,
        "campos":[
          {
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'area',usaToolTip:true}
          },{
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Apellido',nombre:'apellido',tipo:'simple',eslabon:'area',usaToolTip:true}
          },{
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Correo Electronico',nombre:'email',tipo:'simple',eslabon:'area',usaToolTip:true}
          },{
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Clave',nombre:'clave',tipo:'password',eslabon:'area',usaToolTip:true}
          },{
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Confirme Clave',nombre:'clave',tipo:'password',eslabon:'area',usaToolTip:true}
          }
        ]
      }
    };

  self.get = function(atributo){
    var resultado = false;
    if(self.hasOwnProperty(atributo)){
        resultado = self[atributo];
    }else{
      console.error("self no posee la propiedad "+atributo);
    }
    return resultado;
  };

  self.crearModal = function(){
    self.modal = UI.crearVentanaModal({
      clases:['logIn'],
      cabecera:{
        html: '<div class="material-icons md-36 lightgreen500">account_circle</div>'
      },
      cuerpo:{
        html: ""
      },
      pie:{
          clases:['botonera'],
          html: ""
      }
    });
    //agregamos que al precionar la capa exterior nos limpie el valor de modal de la libreria
    UI.elementos.modalWindow.capas[0].nodo.onclick = function(){
     self.modal=null;
     UI.elementos.modalWindow.eliminarUltimaCapa();   
    }
    return self.modal;
  };

  self.construirLogin = function(){
    var modal = self.get("modal");
    if(!modal){
      modal = self.crearModal();
    }
    modal.partes.cuerpo.nodo.innerHTML = '';
    modal.partes.cuerpo.agregarFormulario({
      "formulario":self.plano.logIn,
      "tipo": 'nuevo'
    });
    modal.partes.pie.nodo.innerHTML ='<button type="button" nombre="enviar" class="mat-text-but">Accesar</button>'+
                                      '<button type="button" nombre="registrar" class="mat-text-but">Registrate</button>';
    modal.partes.pie.detectarBotones();
    modal.partes.pie.buscarBoton('enviar').nodo.onclick = function(){
      var formulario = modal.partes.cuerpo.formulario;
      if(!formulario.validar()){
        UI.agregarToasts({
          texto: 'Debe llenar los campos antes de continuar',
          tipo: 'web-arriba-derecha-alto'
        });
      }else{
        var peticion = UI.juntarObjetos({
           entidad: "cliente",
           operacion: "accesar"
        },formulario.captarValores());
        var cuadro = {
          contenedor: modal.partes.cuerpo.nodo,
          cuadro:{
            nombre: 'Accesar',
            mensaje: 'Verificando Datos de Sesion'
          }
        };
        modal.partes.pie.desaparecer();
        torque.manejarOperacion(peticion,cuadro)
          .then(function(resultado){
            if(!resultado.success){            
              self.modal.partes.cuerpo.nodo.innerHTML = JSON.stringify(resultado.registro);
            }else{
              //Arranco y creo la session
              var sesion = new Sesion();
              sesion
                .crear(resultado.perfil,resultado.tokenKey)
                .then(function(){
                  var html = "<div mensaje>Bienvenido <span resaltado>"+resultado.perfil.nombre.toLowerCase()+" "+resultado.perfil.apellido.toLowerCase()+"</span></div>";
                  self.modal.partes.cuerpo.nodo.style.height = "80px";
                  self.modal.partes.pie.desaparecer();
                  self.modal.nodo.classList.add('exitoso');
                  self.modal.partes.cabecera.nodo.querySelector('div.md-36').classList.remove('lightgreen500');
                  self.modal.partes.cabecera.nodo.querySelector('div.md-36').classList.add('white');
                  self.modal.partes.cuerpo.nodo.innerHTML = html;
                });                
            }
          },function(){
            var html = "<div mensaje>Error de Autenticacion</div>";
            self.modal.partes.cuerpo.nodo.style.height = "80px";
            self.modal.partes.pie.desaparecer();
            self.modal.nodo.classList.add('fallido');
            self.modal.partes.cabecera.nodo.querySelector('div.md-36').classList.remove('lightgreen500');
            self.modal.partes.cabecera.nodo.querySelector('div.md-36').classList.add('white');
            self.modal.partes.cuerpo.nodo.innerHTML = html;
          });
      }
    };
    modal.partes.pie.buscarBoton('registrar').nodo.onclick = function(){
      self.construirRegistro(modal);
    };
  };

  self.construirRegistro = function(){
    var modal = self.get("modal");
    if(!modal){
      modal = self.crearModal();
    }
    modal.partes.cuerpo.nodo.innerHTML = '';
    modal.partes.cuerpo.agregarFormulario({
      "formulario" : self.plano.registrate,
      "tipo": "nuevo"
    });
    modal.partes.pie.nodo.innerHTML ='<button type="button" nombre="enviar" class="mat-text-but">Enviar Registro</button>'+
              '<button type="button" nombre="volver" class="mat-text-but">Volver</button>';
    modal.partes.pie.detectarBotones();
    modal.partes.pie.buscarBoton('volver').nodo.onclick = function(){
      self.construirLogin();
    };
    modal.partes.pie.buscarBoton('enviar').nodo.onclick = function(){
      var formulario = modal.partes.cuerpo.formulario;
      if(!formulario.validar()){
        UI.agregarToasts({
          texto: 'Debe llenar los campos antes de continuar',
          tipo: 'web-arriba-derecha-alto'
        });
      }else{
        var peticion = UI.juntarObjetos({
           "entidad": "cliente",
           "operacion": "registrar"
        },formulario.captarValores());
        var cuadro = {
          "contenedor": modal.partes.cuerpo.nodo,
          "cuadro":{
            nombre: 'registro',
            mensaje: 'Guardando Perfil'
          }
        };
        torque.manejarOperacion(peticion,cuadro)
          .then(function(resultado){
            if(!resultado.success){            
              self.modal.partes.cuerpo.nodo.innerHTML = JSON.stringify(resultado.registro);
            }else{
              var html = "<div mensaje>Bienvenido <span resaltado>"+resultado.registro.nombre.toLowerCase()+" "+resultado.registro.apellido.toLowerCase()+"</span>"+
                        "<br>Revisa tu correo electronico(<span resaltado>"+resultado.registro.email.toLowerCase()+"</span>)"+
                        " te hemos enviado un regalo ;)</div>";
              self.modal.partes.cuerpo.nodo.style.height = "120px"
              self.modal.partes.pie.desaparecer();
              self.modal.nodo.classList.add('exitoso');
              self.modal.partes.cabecera.nodo.querySelector('div.md-36').classList.remove('lightgreen500');
              self.modal.partes.cabecera.nodo.querySelector('div.md-36').classList.add('white');
              self.modal.partes.cuerpo.nodo.innerHTML = html;
            }
          });
      }
    };
  };
};
