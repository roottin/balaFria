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
				esconderBarraBusqueda(lista);
			}
		}
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
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		return map;
	}).then(function(mapa){
		var lista = UI.buscarVentana('tiendas');
		console.log(lista);
		agregarTiendasAlMapa(mapa,lista);
	});
}

var esconderBarraBusqueda = function(lista){

};
var armarTienda = function(slot){
	var datos = slot.atributos;
	slot.nodo.classList.add('tienda');
	var html = "<div parte-izq><img class='muestra' src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/220px-Eq_it-na_pizza-margherita_sep2005_sml.jpg'></img></div>"+
							"<div parte-der>"+
								"<div titulo>"+datos.nombre+"</div>"+
								"<div detalle>"+datos.descripcion+"</div>"+
							"</div>";
		slot.nodo.innerHTML = html;
};
var agregarTiendasAlMapa = function(mapa,lista){
	lista.Slots.forEach(function(tienda){
	  tienda.marker = new google.maps.Marker({
	    position: {lat: parseFloat(tienda.atributos.lat), lng: parseFloat(tienda.atributos.lng)},
	    map: mapa
	  });
	});
};
