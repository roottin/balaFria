/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('producto_precio', {
    id_producto_precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'producto',
        key: 'id_producto'
      }
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_final: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'producto_precio'
  });
};
