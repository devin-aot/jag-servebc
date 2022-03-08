const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('note', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        body: {
            type: DataTypes.STRING,
            field: 'body'
        },
        username: {
            type: DataTypes.STRING,
            field: 'username'
        }
	},
    {
        underscored: true,
        timestamps: true,
        updatedAt: false,
        createdAt: 'date'
    });
};
