/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pais', {
    id_pais: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codigo_postal: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'pais'
  });
};
