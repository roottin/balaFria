/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zona_envio', {
    id_zona_envio: {
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
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sucursal',
        key: 'id_sucursal'
      }
    }
  }, {
    tableName: 'zona_envio'
  });
};
