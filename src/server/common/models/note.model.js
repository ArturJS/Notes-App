const Notes = (sequelize, DataTypes) => {
    const NotesModel = sequelize.define('Notes', {
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

    NotesModel.associate = models => {
        NotesModel.belongsTo(models.Users, {
            foreignKey: 'userId',
            onDelete: 'CASCADE'
        });
    };

    return NotesModel;
};

// export default Notes;
module.exports = Notes;
