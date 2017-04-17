/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursal_rubro', {
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
      }
    },
    id_rubro: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rubro',
        key: 'id_rubro'
      }
    }
  }, {
    tableName: 'sucursal_rubro'
  });
};
