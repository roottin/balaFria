var ConsUsuario = function(){
	var self = this;
	self.construirUI = function(sesion){
		UI.elementos.botonera = new Botonera({
			"contenedor":document.body.querySelector('div[contenedor]'),
			"botones":[
				"abrir",
				{
					tipo:'Seguridad',
					clases: ['material-icons','mat-blue500','white','md-18'],
					click:function(){
						self.favoritos();
					},
					contenido: 'security'
				},{
					tipo:'formas pago',
					clases: ['material-icons','mat-bluegrey500','white','md-18'],
					click:function(){
						self.favoritos();
					},
					contenido: 'payment'
				},{
					tipo:'Datos Personales',
					clases: ['material-icons','mat-lightgreen500','white','md-18'],
					click:function(){
						self.favoritos();
					},
					contenido: 'account_circle'
				},{
					tipo:'Actividad',
					clases: ['material-icons','mat-lightblue500','white','md-18'],
					click:function(){
						self.favoritos();
					},
					contenido: 'history'
				},{
					tipo:'favorito',
					clases: ['material-icons','mat-amber500','white','md-18'],
					click:function(){
						self.favoritos();
					},
					contenido: 'grade'
				}
			]
		});
	};
};
