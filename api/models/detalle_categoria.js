/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalle_categoria', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_detalle_menu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'detalle_menu',
        key: 'id'
      },
      unique: true
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'producto',
        key: 'id_producto'
      }
    }
  }, {
    tableName: 'detalle_categoria'
  });
};
