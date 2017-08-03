/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categoria', {
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id_proveedor'
      }
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'categoria'
  });
};
