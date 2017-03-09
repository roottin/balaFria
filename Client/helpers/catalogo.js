var map;
function construirUI(){
	bone.usarLib('customMarker')
		.then(function(lib){
			//armo el contenedor
			var contMapa = UI.agregarVentana({
				nombre:'contMapa',
				clases:['contMapa'],
				sectores:[
					{
						nombre:'mapa',
						html:'<div mapa></div>'
					}
				]
			},document.querySelector('div[contenedor]'));
			//agrego el mapa
			map = new google.maps.Map(contMapa.buscarSector('mapa').nodo, {
				center: {lat: 9.55972, lng: -69.20194},
				zoom: 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			return map;
		})
		.then(function(){
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
							agregarTiendasAlMapa(map,slot);
						});
					}
				},
				onclickSlot: abrirTienda
			},document.querySelector('div[contenedor]'));

			//funcionamiento botones cabecera
			UI.elementos.cabecera.nodo.querySelector('div.btnLog').onclick = function(){
				bone.usarLib('logIn')
					.then(function(lib){
						if(!lib.op){
							lib.op = new Login();
						}
						lib.op.construirLogin();
					});
			};
			UI.elementos.cabecera.nodo.querySelector('div.btnMap').onclick = function(){
				var mapa = UI.buscarVentana('contMapa').nodo;
				if(mapa.classList.contains('visible')){
					mapa.classList.remove('visible');
					lista.nodo.classList.remove('oculto');
				}else{
					mapa.classList.add('visible');
					lista.nodo.classList.add('oculto');
				}
			};
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
var agregarTiendasAlMapa = function(mapa,tienda){
		tienda.marker = new CustomMarker({
		    position: new google.maps.LatLng(parseFloat(tienda.atributos.lat),parseFloat(tienda.atributos.lng)),
		    map: mapa,
		    img:'img/thumbnails/'+tienda.atributos.img,
				id: tienda.atributos.id,
				click: function(){
					abrirTienda(tienda);
				}
	  	});
};
