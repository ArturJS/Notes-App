const Note = (sequelize, DataTypes) => {
    const NoteModel = sequelize.define('Note', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        files: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        prevId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        nextId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });

    NoteModel.associate = models => {
        NoteModel.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    return NoteModel;
};

export default Note;
