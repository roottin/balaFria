/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('direccion_cliente', {
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
      }
    },
    id_coordenada: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'coordenada',
        key: 'id_coordenada'
      }
    }
  }, {
    tableName: 'direccion_cliente'
  });
};
