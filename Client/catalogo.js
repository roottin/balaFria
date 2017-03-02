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
	var puntuacion = '<i class="material-icons white md-24">star</i>'+
									 '<i class="material-icons white md-24">star</i>'+
									 '<i class="material-icons white md-24">star</i>'+
									 '<i class="material-icons white md-24">star</i>';
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
							'<div class="material-icons white md-32">star</div>'+
							'<div class="material-icons white md-32">home</div>'+
							'<div class="material-icons white md-32">list</div>'+
						'</div>'+
						'<section star class="izquierda">opiniones</section>'+
						'<section home class="seleccionado">home</section>'+
						'<section menu class="derecha">MENU</section>'
	  }
	});
	modal.nodo.classList.remove('ancho');
	modal.partes.cuerpo.nodo.querySelectorAll()
};
