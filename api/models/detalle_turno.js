/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalle_turno', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dia: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    desde: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hasta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_turno: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'turno',
        key: 'id_turno'
      }
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "A"
    }
  }, {
    tableName: 'detalle_turno'
  });
};
