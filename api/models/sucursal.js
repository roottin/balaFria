/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursal', {
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "F"
    },
    id_proveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id_proveedor'
      }
    },
    id_coordenada: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'coordenada',
        key: 'id_coordenada'
      }
    },
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ciudad',
        key: 'id_ciudad'
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'sucursal'
  });
};
