/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('imagen_rubro', {
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
    id_rubro: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rubro',
        key: 'id_rubro'
      }
    },
    id_tipo_imagen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipo_imagen',
        key: 'id_tipo_imagen'
      }
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "A"
    }
  }, {
    tableName: 'imagen_rubro'
  });
};
