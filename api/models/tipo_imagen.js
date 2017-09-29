/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tipo_imagen', {
    id_tipo_imagen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'tipo_imagen'
  });
};
