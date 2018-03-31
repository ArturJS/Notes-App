const User = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
