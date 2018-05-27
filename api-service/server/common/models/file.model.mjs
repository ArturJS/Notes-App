const Files = (sequelize, DataTypes) => {
    const FilesModel = sequelize.define('Files', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        downloadPath: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    FilesModel.associate = models => {
        FilesModel.belongsTo(models.Users, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    return FilesModel;
};

export default Files;
