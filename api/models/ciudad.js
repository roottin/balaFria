/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ciudad', {
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zoom: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id_pais: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pais',
        key: 'id_pais'
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
    tableName: 'ciudad'
  });
};
