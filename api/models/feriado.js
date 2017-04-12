/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feriado', {
    id_feriado: {
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
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    },
    horario_envio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    horario_atencion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'feriado'
  });
};
