const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('contact', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        email: {
            type: DataTypes.STRING,
            field: 'email'
        },
        phone: {
            type: DataTypes.STRING,
            field: 'phone'
        },
	},
    {
        underscored: true,
        timestamps: false,
    });
};
