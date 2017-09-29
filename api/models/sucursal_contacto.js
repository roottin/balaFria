/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sucursal_contacto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    id_sucursal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sucursal',
        key: 'id_sucursal'
      }
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    valor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'sucursal_contacto'
  });
};
