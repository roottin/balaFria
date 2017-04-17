/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cliente', {
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: true
    },
    documento: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    recibir_oferta: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "N"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    email_secudario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clave: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'cliente'
  });
};
