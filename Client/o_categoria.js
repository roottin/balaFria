var Categoria = function(cons){
  var self = this;
  self.atributos = cons;
  self.productos = [];

  self.construirNodo = function(){
    var nodo = document.createElement('div');
    nodo.setAttribute('categoria','');
    nodo.innerHTML = '<header>'+
          			'<div nombre>'+self.atributos.nombre+'</div>'+
          			'<img cat src="'+self.atributos.img+'"></img>'+
          		'</header>'+
              '<section cont>'+
              '</section>';
    self.nodo = nodo;
    self.llenarProductos();
  };
  self.llenarProductos = function(){
    self.atributos.productos.forEach(function(producto){
      var newProd = new Producto(producto);
      self.productos.push(newProd);
      self.nodo.querySelector('section[cont]').appendChild(newProd.nodo);
    });
  };
  self.construirNodo();
};

var Producto = function(cons){
  var self = this;
  self.atributos = cons;
  self.imagenes = [];

  self.construirNodo = function(){
    var nodo = document.createElement('div');
    nodo.classList.add('producto');
    nodo.innerHTML='<div parte-izq>'+
                  '</div>'+
                  '<div parte-der>'+
                    '<div titulo>'+self.atributos.nombre+'</div>'+
                    '<div detalle>'+self.atributos.descripcion+'</div>'+
                    //TODO: dar funcionamiento al boton
                    '<button codigo="'+self.atributos.id+'" class="material-icons white mat-green500 md-24 shop">add_shopping_cart</button>'+
                  '</div>';
    self.nodo = nodo;
    self.parteIzq = nodo.querySelector('div[parte-izq]');
    self.parteDer = nodo.querySelector('div[parte-der]');
    self.cargarImagenes();
  };

  self.cargarImagenes = function(){
    self.atributos.imagenes.forEach(function(imagen){
      var nodo = document.createElement('img');
      nodo.src = imagen.ruta;
      nodo.classList.add('muestra');
      nodo.onload = function(){
        console.log('cargo');
      };
      self.parteIzq.appendChild(nodo);
      self.imagenes.push(nodo);
    });
  };

  self.construirNodo();
};
