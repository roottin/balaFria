module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tipo_imagen', [
        {id_tipo_imagen:1,nombre: "Banner", descripcion: "imagen tipo banner", createdAt: Sequelize.fn('now'), updatedAt: Sequelize.fn('now') },
        {id_tipo_imagen:2,nombre: "Avatar", descripcion: "imagen tipo Avatar", createdAt: Sequelize.fn('now'), updatedAt: Sequelize.fn('now') }
        ],{}
      );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete({tableName: 'tipo_imagen'}, null, {});
  }
};
