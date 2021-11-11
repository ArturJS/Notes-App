module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Files', 'size', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });
        await queryInterface.sequelize.query(
            'UPDATE public."Files" SET size = 0;'
        );
    },
    down: async (queryInterface /* , Sequelize */) => {
        await queryInterface.removeColumn('Files', 'size');
    }
};
