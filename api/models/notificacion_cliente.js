/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notificacion_cliente', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cliente',
        key: 'id_cliente'
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
    tableName: 'notificacion_cliente'
  });
};
