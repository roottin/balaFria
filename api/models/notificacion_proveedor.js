/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notificacion_proveedor', {
    id: {
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
    id_notificacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'notificacion',
        key: 'id_notificacion'
      }
    }
  }, {
    tableName: 'notificacion_proveedor'
  });
};
