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
    lunes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    martes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    miercoles: {
      type: DataTypes.STRING,
      allowNull: true
    },
    jueves: {
      type: DataTypes.STRING,
      allowNull: true
    },
    viernes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sabado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    domingo: {
      type: DataTypes.STRING,
      allowNull: true
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
