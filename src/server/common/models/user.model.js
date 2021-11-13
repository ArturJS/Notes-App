const Users = (sequelize, DataTypes) => {
    const UsersModel = sequelize.define('Users', {
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

    UsersModel.associate = models => {
        UsersModel.hasMany(models.Notes, {
            foreignKey: 'userId',
            as: 'notesList'
        });
    };

    return UsersModel;
};

// export default Users;
module.exports = Users;
