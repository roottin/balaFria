var consUsuario = require('./usuario');
var consAdmin = require('./admin');
var Servidor = {};

Servidor.usuarios=[];
Servidor.admin=null;

Servidor.buscarUsuario = function(id){
  var resultado = false;
  if(this.usuarios.length){
    this.usuarios.forEach(function(usuario){
      if(usuario.perfil.id == id){
        resultado = usuario;
      }
    });
    return resultado;
  }
};
Servidor.addUsuario = function(perfil,socket){
  var nuevoUsuario = this.buscarUsuario(perfil.id);
  if(nuevoUsuario){
    console.warn('server.js - linea:22 - usuario ya esta conectado');
    return false;
  }else{
    nuevoUsuario = consUsuario.crear();
    nuevoUsuario.crear(perfil).agregarConexion(socket);
    this.usuarios.push(nuevoUsuario);
  }
  return nuevoUsuario;
};

Servidor.removeUsuario = function(id){
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
Servidor.addAdmin = function(perfil,socket){
  if(Servidor.admin){
    console.warn('server.js - linea:46 - administrador ya conectado');
    return false;
  }else{
    Servidor.admin = consAdmin.crear();
    Servidor.admin.crear(perfil).agregarConexion(socket);
  }
};

Servidor.mostrarListaUsuarios = function(){
  console.log('------------------------ Usuario Conectados-----------------------');
  this.usuarios.forEach(function(usuario){
    console.log("nombre: "+usuario.perfil.nombre+" "+usuario.perfil.apellido);
    console.log("conexiones: "+usuario.conexiones.length);
  });
  console.log('------------------------ Usuario Conectados-----------------------');
};
Servidor.get = function(tipo){
  if(tipo == "cliente"||tipo=="proveedor"){
    var usuarios = [];
    this.usuarios.forEach(function(each){
      if(tipo == each.perfil.tipo){
        usuarios.push(each);
      }
    });
    return usuarios;
  }
};
module.exports=Servidor;
