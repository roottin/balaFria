/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('coordenada', {
    id_coordenada: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    latitud: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    logitud: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    tableName: 'coordenada'
  });
};
