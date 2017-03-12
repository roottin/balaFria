var Usuario = require('./usuario');
var Server = {};

Server.usuarios=[];

Server.buscarUsuario = function(id){
  var resultado = false;
  if(!this.usuarios.lenght){
    console.log('no posee usuarios conectados');
  }else{
    this.usuarios.forEach(function(usuario){
      if(usuario.perfil.id == id){
        resultado = usuario;
      }
    });
    return resultado;
  }
};
Server.addUsuario = function(perfil,socket){
  var nuevoUsuario = this.buscarUsuario(perfil.id);
  if(nuevoUsuario){
    console.warn('server.js - linea:22 - usuario ya esta conectado');
    return false;
  }else{
    var nuevoUsuario = new Usuario();
    nuevoUsuario.crear(perfil).agregarConexion(socket);
    this.usuarios.push(nuevoUsuario); 
  }
  return nuevoUsuario;
};

Server.removeUsuario = function(id){
  var yo = this;
  var usuario =  this.buscarUsuario(id);
  if(!usuario){    
    console.warn('server.js - linea:35 - usuario no existe');
  }else{
    usuario.cerrarConexiones()
      .then(function(){
        yo.usuarios.splice(this.usuarios.indexOf(usuario),1);
      });
  }
};

Server.mostrarListaUsuarios = function(){
  console.log('------------------------ Usuario Conectados-----------------------');
  this.usuarios.forEach(function(usuario){
    console.log(JSON.stringify(usuario));
  });
  console.log('------------------------ Usuario Conectados-----------------------');
};
module.exports=Server;
