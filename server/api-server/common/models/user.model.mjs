const User = (sequelize, DataTypes) => {
    const UserModel = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    UserModel.associate = models => {
        UserModel.hasMany(models.Note, {
            foreignKey: 'userId',
            as: 'notesList'
        });
    };

    return UserModel;
};

export default User;
