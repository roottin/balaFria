/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('producto', {
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id_proveedor'
      }
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
    tableName: 'producto'
  });
};
