/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('imagen_producto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_imagen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'imagen',
        key: 'id_imagen'
      },
      unique: true
    },
    id_tipo_imagen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipo_imagen',
        key: 'id_tipo_imagen'
      }
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'producto',
        key: 'id_producto'
      }
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "A"
    }
  }, {
    tableName: 'imagen_producto'
  });
};
