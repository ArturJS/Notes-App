const User = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    User.associate = models => {
        User.hasMany(models.Note, {
            foreignKey: 'userId',
            as: 'notesList',
        });
    };

    return User;
};

export default User;
