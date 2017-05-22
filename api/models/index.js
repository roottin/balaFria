
var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../baseDatos/config.json')[env];
var db        = {};

var recrearBaseDeDatos;
if (process.env.DATABASE_URL) {
  recrearBaseDeDatos = true;
  var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

  console.log('----------------------------------------');
  console.log(process.env.DATABASE_URL);
  console.log('----------------------------------------');
  var sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[4],
    host:     match[3],
    logging: false,
    dialectOptions: {
        ssl: true
    }
  });
} else {
  recrearBaseDeDatos = true ;
  console.log('----------------------------------------');
  console.log('Base de datos Local');
  console.log('----------------------------------------');

  var sequelize = new Sequelize(config.database, config.username, config.password, config);
  /*
  var sequelize = new Sequelize(url, {
    dialect:  'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: true
    }
  });
    */

}


fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync({force:recrearBaseDeDatos})
  .then(function(resultado){
    console.log('----------------------------------------');
    console.log('servidor de Base de Datos inicializado');
    console.log('----------------------------------------');

  })
  .catch(function(err) {
    console.log('Server failed to start due to error: %s', err);
  });


module.exports = db;
