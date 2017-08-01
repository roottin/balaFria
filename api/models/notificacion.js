/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notificacion', {
    id_notificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_tipo_notificacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipo_notificacion',
        key: 'id_tipo_notificacion'
      }
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cuerpo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "A"
    }
  }, {
    tableName: 'notificacion'
  });
};
