var models = require('../models/index');
module.exports = function(app){
  //ruta general
  app.get('/', function(req, res, next) {
    res.render('index', {});
  });
  //rutas clientes
  require('./cliente')(app);
  require('./autenticar')(app);
};
