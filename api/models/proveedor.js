/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proveedor', {
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    documento: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "A"
    }
  }, {
    tableName: 'proveedor'
  });
};
