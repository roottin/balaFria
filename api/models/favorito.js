/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('favorito', {
    id: {
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
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cliente',
        key: 'id_cliente'
      }
    }
  }, {
    tableName: 'favorito'
  });
};
