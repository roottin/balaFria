/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('direccion', {
    id_direccion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "A"
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
    tableName: 'direccion'
  });
};
