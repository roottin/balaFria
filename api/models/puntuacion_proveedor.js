/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('puntuacion_proveedor', {
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
    id_proveedor: {
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
    tableName: 'puntuacion_proveedor'
  });
};
