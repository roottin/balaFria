var map;
function construirUI(){
	var lista = UI.agregarLista({
  	titulo: 'Tiendas',
		nombre: 'tiendas',
  	clases: ['completa','tiendas'],
    campo_nombre: 'nombre',
		carga: {
			uso:true,
			peticion:{
				modulo:'global',
				entidad:'proveedor',
				operacion:'listar'
			},
			espera:{
				cuadro:{
					nombre: 'cargando',
					mensaje: 'cargando locales'
				}
			},
			respuesta:function(lista){
				lista.Slots.forEach(function(slot){
					armarTienda(slot);
				});
			}
		},
		onclickSlot: abrirTienda
	},document.querySelector('div[contenedor]'));
	var mapa = UI.agregarVentana({
	  nombre:'contMapa',
		clases:['contMapa'],
	  sectores:[
			{
				nombre:'mapa',
				html:'<div mapa></div>'
			}
		]
	},document.querySelector('div[contenedor]'));
}

function initMap() {
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			if(UI.buscarVentana('contMapa')){
				resolve(UI.buscarVentana('contMapa'));
			}else{
				reject('error');
			}
		},100);
	}).then(function(contMapa){
		map = new google.maps.Map(contMapa.buscarSector('mapa').nodo, {
			center: {lat: 9.55972, lng: -69.20194},
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		return map;
	}).then(function(mapa){

		window.CustomMarker = function(cons) {
			this.latlng = cons.position;
			this.args = cons;
			this.setMap(cons.map);
		};

		window.CustomMarker.prototype = new google.maps.OverlayView();

		window.CustomMarker.prototype.draw = function() {

			var self = this;

			var div = this.div;

			if (!div) {

				div = this.div = document.createElement('div');

				div.className = 'marker';

				div.style.position = 'absolute';
				div.style.cursor = 'pointer';
				div.style.width = '40px';
				div.style.height = '40px';
				div.classList.add("markerLayer");

				if (typeof(self.args.marker_id) !== 'undefined') {
					div.dataset.marker_id = self.args.marker_id;
				}

				if (typeof(self.args.img) !== 'undefined') {
					div  = self.armarImagen(self.args.img,div);
				}

				google.maps.event.addDomListener(div, "click", function(event) {
					google.maps.event.trigger(self, "click");
				});

				var panes = this.getPanes();
				panes.overlayImage.appendChild(div);
			}

			var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

			if (point) {
				div.style.left = point.x + 'px';
				div.style.top = point.y + 'px';
			}
		};

		window.CustomMarker.prototype.remove = function() {
			if (this.div) {
				this.div.parentNode.removeChild(this.div);
				this.div = null;
			}
		};

		window.CustomMarker.prototype.getPosition = function() {
			return this.latlng;
		};
		window.CustomMarker.prototype.armarImagen = function(img,div){
			div.innerHTML='<img src="'+img+'"></img>';
			return div;
		};
		return mapa;
	}).then(function(mapa){
		var lista = UI.buscarVentana('tiendas');
		agregarTiendasAlMapa(mapa,lista);
		return mapa;
	});
}
//---------------------------------------------- Manejo de tiendas --------------------------------------
var armarTienda = function(slot){
	var datos = slot.atributos;
	slot.nodo.classList.add('tienda');
	var html = "<div parte-izq><img class='muestra' src='img/"+slot.atributos.img+"'></img></div>"+
				"<div parte-der>"+
					"<div titulo>"+datos.nombre+"</div>"+
					"<div detalle>"+datos.descripcion+"</div>"+
				"</div>";
	slot.nodo.innerHTML = html;
};
var agregarTiendasAlMapa = function(mapa,lista){
	lista.Slots.forEach(function(tienda){
		tienda.marker = new CustomMarker({
		    position: new google.maps.LatLng(parseFloat(tienda.atributos.lat),parseFloat(tienda.atributos.lng)),
		    map: mapa,
		    img:'img/thumbnails/'+tienda.atributos.img,
				id: tienda.atributos.id
	  	});
	});
};
var abrirTienda = function(tienda){
	var puntuacion = armarPuntuacion(tienda.atributos.puntuacion);
	var modal = UI.crearVentanaModal({
	  contenido: 'ancho',
		clases: ['proveedor'],
	  cabecera:{
	    html: '<img src="img/banner/'+tienda.atributos.img+'"></img>'+
						'<div nombre>'+tienda.atributos.nombre+'</div>'+
						'<div puntuacion>'+puntuacion+'</div>'
	  },
	  cuerpo:{
			html:'<div barra>'+
							'<div star class="material-icons white md-32">star</div>'+
							'<div home class="material-icons white md-32 seleccionado">home</div>'+
							'<div menu class="material-icons white md-32">list</div>'+
						'</div>'+
						'<section star class="izquierda">'+
							'<div puntuacion></div>'+
							'<div opiniones></div>'+
						'</section>'+
						'<section home class="seleccionado">'+
							'<div descripcion></div>'+
							'<div contacto></div>'+
							'<div horarios>'+
								'<aside titulo>Horarios</aside>'+
							'</div>'+
						'</section>'+
						'<section menu class="derecha">'+
						'</section>'
	  }
	});
	modal.nodo.classList.remove('ancho');
	//asigno la tienda a la ventana modal de manera de usar su contenido cuando lo necesite
	modal.tienda = tienda;
	//inicializo las capas
	inicializarCapas(modal);
	//las lleno y les doy funcionamiento
	funcionamientoCapas(modal);
};
function inicializarCapas(modal){
	var cuerpo = modal.partes.cuerpo;
	//capas
	cuerpo.capaHome = modal.partes.cuerpo.nodo.querySelector('section[home]');
		//secciones
		cuerpo.capaHome.contacto = cuerpo.capaHome.querySelector('div[contacto]');
		cuerpo.capaHome.descripcion = cuerpo.capaHome.querySelector('div[descripcion]');
		cuerpo.capaHome.horarios = cuerpo.capaHome.querySelector('div[horarios]');

	cuerpo.capaStar = modal.partes.cuerpo.nodo.querySelector('section[star]');
		//secciones
		cuerpo.capaStar.puntuacion = cuerpo.capaStar.querySelector('div[puntuacion]');
		cuerpo.capaStar.opiniones = cuerpo.capaStar.querySelector('div[opiniones]');

	cuerpo.capaMenu = modal.partes.cuerpo.nodo.querySelector('section[menu]');
	//botones
	cuerpo.btnHome = modal.partes.cuerpo.nodo.querySelector('div[home]');
	cuerpo.btnStar = modal.partes.cuerpo.nodo.querySelector('div[star]');
	cuerpo.btnMenu = modal.partes.cuerpo.nodo.querySelector('div[menu]');

	llenarCapa('home',modal);
}
function funcionamientoCapas(modal){
	var cuerpo = modal.partes.cuerpo;
	cuerpo.btnHome.onclick=function(){
		limpiarCapas(modal);
		cuerpo.btnHome.classList.add('seleccionado');
		cuerpo.capaHome.classList.add('seleccionado');
		cuerpo.capaMenu.classList.add('derecha');
		cuerpo.capaStar.classList.add('izquierda');
		llenarCapa("home",modal);
	};
	cuerpo.btnStar.onclick=function(){
		limpiarCapas(modal);
		cuerpo.btnStar.classList.add('seleccionado');
		cuerpo.capaHome.classList.add('derecha');
		cuerpo.capaMenu.classList.add('derecha');
		cuerpo.capaStar.classList.add('seleccionado');
		llenarCapa("star",modal);
	};
	cuerpo.btnMenu.onclick=function(){
		limpiarCapas(modal);
		cuerpo.btnMenu.classList.add('seleccionado');
		cuerpo.capaHome.classList.add('izquierda');
		cuerpo.capaMenu.classList.add('seleccionado');
		cuerpo.capaStar.classList.add('izquierda');
		llenarCapa("menu",modal);
	};
}
function limpiarCapas(modal){
	modal.partes.cuerpo.nodo.querySelectorAll('section').forEach(function(section){
		section.classList.forEach(function(clase){
			section.classList.remove(clase);
		});
	});
	modal.partes.cuerpo.nodo.querySelector('div[barra]').childNodes.forEach(function(div){
		if(div.classList.contains('seleccionado')){
			div.classList.remove('seleccionado');
		}
	});
}
function llenarCapa(capa,modal){
	var tienda = modal.tienda;
	var cuerpo = modal.partes.cuerpo;
	var peticion;
	var cuadro;
	var html = "";
	switch (capa) {
		case 'home':
			//lleno descricpcion
			cuerpo.capaHome.descripcion.innerHTML = tienda.atributos.descripcion;
			//armo contactos
			html = '<aside titulo>Contacto</aside>'+armarContactos(tienda.atributos.contacto)+'<div style="clear:both"></div>';
			cuerpo.capaHome.contacto.innerHTML = html;
			//TODO: armar horarios
			break;
		case 'star':
			//busco en la bd los valores
			peticion = {
			   entidad: "proveedor",
			   operacion: "buscarOpinion",
			   codigo: tienda.atributos.id
			};
			 cuadro = {
				contenedor: cuerpo.capaStar.opiniones,
				cuadro:{
				  nombre: 'puntuacion',
				  mensaje: 'Cargando puntuacion'
				}
			};
			torque.manejarOperacion(peticion,cuadro)
				.then(function(resultado){
					cuerpo.capaStar.puntuacion.innerHTML = armarStar(resultado.registro);
					cuerpo.capaStar.opiniones.innerHTML = armarOpiniones(resultado.registro);
				});
			break;
			case "menu":
				 peticion = {
				   entidad: "proveedor",
				   operacion: "buscarMenu",
				   codigo: tienda.atributos.id
				};
				torque.Operacion(peticion)
					.then(JSON.parse)
					.then(function(respuesta){
						armarCategoria(respuesta.registro,modal.partes.cuerpo.capaMenu);
					});
				break;
		default:

	}
}
function armarContactos(contactos){
	var html="";
	if(contactos){
		contactos.forEach(function(contacto){
			if (contacto.tipo == "telefono") {
					html+='<aside contacto class="mat-green500 white"><i class="material-icons  icon md-36">call</i> <div>'+contacto.valor+'</div></aside>';
			}
		});
	}else{
		html = "No Posee Datos de Contacto";
	}
	return html;
}
function armarStar(obj){
		var html = "<aside valor>"+obj.puntuacion+"</aside>"+
								"<aside estrellas class='material-icons amber500 md-48'>";

		html += calcularPuntuacion(obj.puntuacion);
		html += "</aside>";
		return html;
}

function armarPuntuacion(puntuacion){
	var html = '<i>star</i><i class="material-icons amber md-24">'+calcularPuntuacion(puntuacion)+'</i>';
	return html;
}
function calcularPuntuacion(puntuacion){
	var texto = "";
	//puntuacion de estrellas marcadas
	for(var x = 0; x < parseInt(puntuacion);x++){
		texto += 'star ';
	}
	//puntuacion estrella faltantes
	for(var y = 0; y < 5 - parseInt(puntuacion);y++){
		texto += 'star_border ';
	}
	return texto;
}
function armarOpiniones(obj){
	console.log(obj);
	var html = "";
	obj.opiniones.forEach(function(opinion){
		html += '<div opinion>'+
							'<div cab>'+
								'<aside logo></aside>'+
								'<aside nombre>'+opinion.usuario+'</aside>'+
								'<aside puntuacion class="material-icons amber500 md-16">'+calcularPuntuacion(opinion.puntuacion)+'</aside>'+
							'</div>'+
							'<div texto>'+opinion.opinion+'</div>'+
						'</div>';
	});
	return html;
}
function armarCategoria(categorias,capa){
		capa.innerHTML = '<aside titulo>Menu</aside>';
		capa.categorias = [];
		categorias.forEach(function(newCat){
			var categoria = new Categoria(newCat);
			capa.appendChild(categoria.nodo);
			capa.categorias.push(categoria);
		});
}
