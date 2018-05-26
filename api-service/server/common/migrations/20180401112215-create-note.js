module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('Notes', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            files: {
                type: Sequelize.JSONB,
                allowNull: true
            },
            prevId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            nextId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            userId: {
                type: Sequelize.INTEGER,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'userId'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }),
    down: (queryInterface /* , Sequelize */) => {
        queryInterface.dropTable('Notes');
    }
};
