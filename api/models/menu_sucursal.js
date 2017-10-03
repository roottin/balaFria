/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menu_sucursal', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sucursal',
        key: 'id_sucursal'
      },
      unique: true
    },
    id_menu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'menu',
        key: 'id_menu'
      }
    }
  }, {
    tableName: 'menu_sucursal'
  });
};
