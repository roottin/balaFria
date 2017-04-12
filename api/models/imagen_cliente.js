/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('imagen_cliente', {
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
    id_imagen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'imagen',
        key: 'id_imagen'
      }
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "A"
    }
  }, {
    tableName: 'imagen_cliente'
  });
};
