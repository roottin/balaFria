/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('puntuacion_sucursal', {
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
      },
      unique: true
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    puntuacion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    opinion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'puntuacion_sucursal'
  });
};
