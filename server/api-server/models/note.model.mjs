const Note = (sequelize, DataTypes) => {
    const Note = sequelize.define('Note', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        files: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        prevId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        nextId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    });

    Note.associate = models => {
        Note.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    };

    return Note;
};

export default Note;
