/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('direccion_sucursal', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_direccion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'direccion',
        key: 'id_direccion'
      },
      unique: true
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sucursal',
        key: 'id_sucursal'
      }
    }
  }, {
    tableName: 'direccion_sucursal'
  });
};
