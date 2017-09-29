/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalle_zona_envio', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    secuencia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_coordenada: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'coordenada',
        key: 'id_coordenada'
      }
    },
    id_zona_envio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'zona_envio',
        key: 'id_zona_envio'
      }
    }
  }, {
    tableName: 'detalle_zona_envio'
  });
};
