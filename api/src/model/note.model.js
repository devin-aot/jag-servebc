const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('note', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: {
            type: DataTypes.DATE,
            field: 'date'
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
        timestamps: false,
    });
};
