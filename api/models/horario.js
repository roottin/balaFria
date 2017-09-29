/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('horario', {
    id_horario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "A"
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sucursal',
        key: 'id_sucursal'
      }
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "A"
    }
  }, {
    tableName: 'horario'
  });
};
