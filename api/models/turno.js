/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('turno', {
    id_turno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "A"
    },
    id_horario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'horario',
        key: 'id_horario'
      }
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "A"
    }
  }, {
    tableName: 'turno'
  });
};
